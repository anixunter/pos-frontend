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

interface EditCategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
  onSuccess,
}: EditCategoryDialogProps){
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const {updateCategory} = useCategoryStore()

  // Reset form whenever dialog opens OR category changes
  useEffect(() => {
    if (open && category) {
      setName(category.name)
      setDescription(category.description || "")
    }
    // Optional: Reset when dialog closes (cleanup)
    if (!open) {
      setName("")
      setDescription("")
    }
  }, [open, category]) // ← Key: depends on both open and category

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return

    try {
      await updateCategory(category.id, {name, description})
      onSuccess?.()
      onOpenChange(false) // close after success
    } catch (error){
      console.error("Failed to update category", error)
      // optionally show toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category details below.
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

