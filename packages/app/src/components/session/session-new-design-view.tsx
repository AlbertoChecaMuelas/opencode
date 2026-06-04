import type { JSX } from "solid-js"

export function NewSessionDesignView(props: { children: JSX.Element }) {
  return (
    <div data-component="session-new-design" class="relative size-full overflow-hidden bg-v2-background-bg-deep ">
      <div class="absolute inset-x-0 top-[25.375%] flex justify-center px-6">
        <div class="w-full max-w-[720px]">
          <div class="select-none font-bold tracking-[0.2em] opacity-12 text-[clamp(2rem,8vw,6rem)] uppercase">ATENEA</div>
          <div class="mt-8">{props.children}</div>
        </div>
      </div>
    </div>
  )
}
