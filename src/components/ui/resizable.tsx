"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
import * as ResizablePanels from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePanels.Group>) => (
  <ResizablePanels.Group
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePanels.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePanels.Separator> & {
  withHandle?: boolean
}) => (
  <ResizablePanels.Separator
    className={cn(
      "relative flex w-px items-center justify-center bg-border",
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePanels.Separator>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }