import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCategoryStore } from "@/stores/categoryStore"
import type { Category } from "@/pages/Categories/Categories" // category type
import { useEffect, useState } from "react"

type DialogMode = "create" | "edit"

interface CategoryDialogProps {
  mode: DialogMode
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CategoryDialog({
  mode,
  category,
  open,
  onOpenChange,
  onSuccess,
}: CategoryDialogProps){
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const {createCategory, updateCategory} = useCategoryStore()

  // Reset form when dialog opens or mode/category changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && category) {
        setName(category.name)
        setDescription(category.description || "")
      } else {
        // create mode — start fresh
        setName("")
        setDescription("")
      }
    }
  }, [open, mode, category])

  const isEdit = mode === "edit"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && category){
      await updateCategory(category.id, {name, description})
      } else {
        await createCategory({name, description})
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error){
      console.error(`Failed to ${isEdit ? "update" : "create"} category`, error)
      // optionally show toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the category details below."
              : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

