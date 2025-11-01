"use client"

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type TreeViewElement = {
  id: string
  name: string
  isSelectable?: boolean
  children?: TreeViewElement[]
}

type TreeContextProps = {
  selectedId: string | undefined
  expandedItems: string[]
  handleExpand: (id: string) => void
  selectItem: (id: string) => void
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
  indicator: boolean
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  direction: "rtl" | "ltr"
}

const TreeContext = createContext<TreeContextProps | null>(null)

const useTree = () => {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider")
  }
  return context
}

type Direction = "rtl" | "ltr" | undefined

type TreeViewProps = {
  initialSelectedId?: string
  indicator?: boolean
  elements?: TreeViewElement[]
  initialExpandedItems?: string[]
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      dir,
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(
      initialSelectedId
    )
    const [expandedItems, setExpandedItems] = useState<string[]>(
      initialExpandedItems ?? []
    )

    const selectItem = useCallback((id: string) => {
      setSelectedId(id)
    }, [])

    const handleExpand = useCallback((id: string) => {
      setExpandedItems((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return [...prev, id]
      })
    }, [])

    const expandSpecificTargetedElements = useCallback(
      (elements?: TreeViewElement[], selectId?: string) => {
        if (!elements || !selectId) return
        const findParent = (
          currentElement: TreeViewElement,
          currentPath: string[] = []
        ) => {
          const isSelectable = currentElement.isSelectable ?? true
          const newPath = [...currentPath, currentElement.id]
          if (currentElement.id === selectId) {
            if (isSelectable) {
              setExpandedItems((prev) => [...prev, ...newPath])
            } else {
              newPath.pop()
              setExpandedItems((prev) => [...prev, ...newPath])
            }
            return
          }
          if (
            isSelectable &&
            currentElement.children &&
            currentElement.children.length > 0
          ) {
            currentElement.children.forEach((child) => {
              findParent(child, newPath)
            })
          }
        }
        elements.forEach((element) => {
          findParent(element)
        })
      },
      []
    )

    React.useEffect(() => {
      if (initialSelectedId) {
        expandSpecificTargetedElements(elements, initialSelectedId)
      }
    }, [initialSelectedId, elements, expandSpecificTargetedElements])

    const direction = dir === "rtl" ? "rtl" : "ltr"

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          setExpandedItems,
          indicator,
          openIcon,
          closeIcon,
          direction,
        }}
      >
        <div className={cn("size-full", className)}>
          <div className="relative h-full overflow-hidden">
            <AccordionPrimitive.Root
              {...props}
              type="multiple"
              className="flex flex-col gap-1"
              value={expandedItems}
              onValueChange={(value) => setExpandedItems(value as string[])}
              dir={dir as Direction}
            >
              {children}
            </AccordionPrimitive.Root>
          </div>
        </div>
      </TreeContext.Provider>
    )
  }
)

Tree.displayName = "Tree"

const TreeIndicator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { direction } = useTree()

  return (
    <div
      dir={direction}
      ref={ref}
      className={cn(
        "bg-muted absolute left-1.5 h-full w-px rounded-md py-3 duration-300 ease-in-out hover:bg-slate-300 rtl:right-1.5",
        className
      )}
      {...props}
    />
  )
})

TreeIndicator.displayName = "TreeIndicator"

type FolderProps = {
  expandedItems?: string[]
  element: string
  isSelectable?: boolean
  isSelect?: boolean
  handleSelect?: (id: string) => void
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

const Folder = forwardRef<
  HTMLDivElement,
  FolderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      element,
      value,
      isSelectable = true,
      isSelect,
      children,
      handleSelect,
      ...props
    },
    ref
  ) => {
    const {
      direction,
      expandedItems,
      indicator,
      openIcon,
      closeIcon,
    } = useTree()

    const isExpanded = expandedItems.includes(value)

    return (
      <AccordionPrimitive.Item
        {...props}
        value={value}
        className="relative"
      >
        <AccordionPrimitive.Trigger
          className={cn(
            `flex items-center gap-1 rounded-md text-sm px-2 py-1 w-full text-left transition-all duration-300 ease-in-out`,
            className,
            {
              "bg-muted rounded-md font-bold": isSelect && isSelectable,
              "cursor-pointer hover:bg-muted/50 hover:scale-[1.02]": isSelectable,
              "cursor-not-allowed opacity-50": !isSelectable,
              "hover:shadow-sm": isSelectable,
            }
          )}
          disabled={!isSelectable}
          onClick={(e) => {
            if (handleSelect) {
              handleSelect(value)
            }
          }}
        >
          {isExpanded
            ? (openIcon ?? <FolderOpenIcon className="size-4" />)
            : (closeIcon ?? <FolderIcon className="size-4" />)}
          <span className="transition-all duration-200">{element}</span>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative ml-5 rtl:mr-5 rtl:ml-0">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <div className="flex flex-col gap-1 py-1">
            {children}
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }
)

Folder.displayName = "Folder"

const File = forwardRef<
  HTMLButtonElement,
  {
    value: string
    handleSelect?: (id: string) => void
    isSelectable?: boolean
    isSelect?: boolean
    fileIcon?: React.ReactNode
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    {
      value,
      className,
      handleSelect,
      isSelectable = true,
      isSelect,
      fileIcon,
      children,
      ...props
    },
    ref
  ) => {
    const { direction, selectedId, selectItem } = useTree()
    const isSelected = isSelect ?? selectedId === value
    
    return (
      <button
        ref={ref}
        type="button"
        disabled={!isSelectable}
        className={cn(
          "flex w-full items-center gap-1 rounded-md px-2 py-1 text-sm text-left transition-all duration-300 ease-in-out rtl:text-right",
          {
            "bg-muted font-bold": isSelected && isSelectable,
            "hover:bg-muted/50 hover:scale-[1.02]": isSelectable,
            "hover:shadow-sm": isSelectable,
          },
          isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          className
        )}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (handleSelect) {
            handleSelect(value)
          } else {
            selectItem(value)
          }
        }}
        {...props}
      >
        {fileIcon ?? <FileIcon className="size-4" />}
        <span className="transition-all duration-200">{children}</span>
      </button>
    )
  }
)

File.displayName = "File"

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[]
    expandAll?: boolean
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, children, ...props }, ref) => {
  const { expandedItems, setExpandedItems } = useTree()

  const expandAllTree = useCallback((elements: TreeViewElement[]) => {
    const expandTree = (element: TreeViewElement) => {
      const isSelectable = element.isSelectable ?? true
      if (isSelectable && element.children && element.children.length > 0) {
        setExpandedItems((prev) => [...prev, element.id])
        element.children.forEach(expandTree)
      }
    }
    elements.forEach(expandTree)
  }, [])

  const closeAll = useCallback(() => {
    {
      setExpandedItems([])
    }
  }, [])

  React.useEffect(() => {
    if (expandAll) {
      expandAllTree(elements)
    }
  }, [expandAll, elements, expandAllTree])

  return (
    <button
      type="button"
      className="absolute right-2 bottom-1 h-8 w-fit p-1"
      onClick={
        expandedItems && expandedItems.length > 0
          ? closeAll
          : () => expandAllTree(elements)
      }
      ref={ref}
      {...props}
    >
      {children}
      <span className="sr-only">Toggle</span>
    </button>
  )
})

CollapseButton.displayName = "CollapseButton"

export { CollapseButton, File, Folder, Tree, type TreeViewElement }
