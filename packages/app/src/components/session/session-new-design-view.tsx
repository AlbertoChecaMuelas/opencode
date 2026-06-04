import type { JSX } from "solid-js"

export function NewSessionDesignView(props: { children: JSX.Element }) {
  return (
    <div data-component="session-new-design" class="relative size-full overflow-hidden bg-v2-background-bg-deep ">
      <div class="absolute inset-x-0 top-[25.375%] flex justify-center px-6">
        <div class="w-full max-w-[720px]">
          <div
            class="overflow-hidden w-full text-center tracking-[0.05em] opacity-[0.15] text-[clamp(4rem,12vw,11rem)] uppercase leading-none mb-10 select-none"
            style="-webkit-text-stroke: clamp(1px, 0.04em, 3px) currentColor"
          >ATENEA</div>
          <div class="mt-8">{props.children}</div>
        </div>
      </div>
    </div>
  )
}
