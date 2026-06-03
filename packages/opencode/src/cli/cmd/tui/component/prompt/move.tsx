import { createEffect, createMemo, createSignal, onCleanup } from "solid-js"
import { errorMessage } from "@/util/error"
import { useDialog } from "@tui/ui/dialog"
import { useSDK } from "@tui/context/sdk"
import { useSync } from "@tui/context/sync"
import { useToast } from "@tui/ui/toast"
import { DialogMoveSession, type MoveSessionSelection } from "../dialog-move-session"
import { DialogWorkspaceFileChanges } from "../dialog-workspace-file-changes"
import { useHomeSessionDestination } from "../../routes/home/session-destination"

export function usePromptMove(input: { projectID: () => string | undefined; sessionID: () => string | undefined }) {
  const dialog = useDialog()
  const sdk = useSDK()
  const sync = useSync()
  const toast = useToast()
  const homeDestination = useHomeSessionDestination()
  const [creating, setCreating] = createSignal(false)
  const [creatingDots, setCreatingDots] = createSignal(3)
  const [progress, setProgress] = createSignal<string>()

  async function create() {
    setCreating(true)
    setProgress("Creating copy")
    try {
      const result = await sdk.client.worktree.create({}, { throwOnError: true })
      const directory = result.data?.directory
      if (!directory) throw new Error("No worktree directory returned")
      setProgress("Creating session")
      return directory
    } catch (err) {
      homeDestination?.clear()
      setProgress(undefined)
      setCreating(false)
      toast.show({ title: "Creating workspace failed", message: errorMessage(err), variant: "error" })
      return
    }
  }

  function open() {
    const projectID = input.projectID()
    if (!projectID) return
    dialog.replace(() => (
      <DialogMoveSession
        projectID={projectID}
        onSelect={(selection) => {
          const sessionID = input.sessionID()
          if (!sessionID) {
            homeDestination?.setDestination(selection)
            dialog.clear()
            return
          }
          void moveExistingSession(sessionID, selection)
        }}
      />
    ))
  }

  async function moveExistingSession(sessionID: string, selection: MoveSessionSelection) {
    const session = sync.session.get(sessionID)
    const status = await sdk.client.vcs.status({ directory: session?.directory }).catch(() => undefined)
    const choice = status?.data?.length ? await DialogWorkspaceFileChanges.show(dialog, status.data) : "no"
    if (!choice) return
    const directory = selection.type === "new" ? await create() : selection.directory
    if (!directory) {
      setProgress(undefined)
      dialog.clear()
      return
    }
    setProgress("Moving session")
    await sdk.client.experimental.controlPlane
      .moveSession(
        {
          sessionID,
          destination: { directory },
          moveChanges: choice === "yes",
        },
        { throwOnError: true },
      )
      .then(() => dialog.clear())
      .catch((error) => {
        toast.error(error)
        dialog.clear()
      })
      .finally(() => {
        setProgress(undefined)
        setCreating(false)
      })
  }

  const pending = createMemo(() => Boolean(homeDestination?.destination()))

  const directory = createMemo(() => {
    const value = homeDestination?.destination()
    return value?.type === "directory" ? value.directory : undefined
  })

  async function directoryForSubmit() {
    const value = homeDestination?.destination()
    if (!value) return
    if (value.type === "directory") {
      return value.directory
    }
    return await create()
  }

  function startSubmit() {
    if (progress()) setProgress("Submitting prompt")
  }

  function finishSubmit() {
    setProgress(undefined)
    setCreating(false)
  }

  createEffect(() => {
    if (!creating()) {
      setCreatingDots(3)
      return
    }
    const timer = setInterval(() => setCreatingDots((dots) => (dots % 3) + 1), 1000)
    onCleanup(() => clearInterval(timer))
  })

  return { creating, creatingDots, directory, directoryForSubmit, finishSubmit, open, pending, progress, startSubmit }
}
