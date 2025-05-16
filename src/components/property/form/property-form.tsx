"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { defaultProperty } from "@/lib/constants";
import { propertyInputSchema, type PropertyInput } from "@/lib/types";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PropertyFormFields } from "./form-fields";
import { PropertyFormTrigger } from "./triggers";

export interface PropertyFormProps {
  editMode?: boolean;
  propertyToEdit?: PropertyInput & { id: string };
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function PropertyForm({
  editMode = false,
  propertyToEdit,
  onSuccess,
  trigger,
}: PropertyFormProps) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const form = useForm<PropertyInput>({
    resolver: zodResolver(propertyInputSchema),
    defaultValues: defaultProperty,
  });

  const { mutateAsync: addProperty } = api.property.create.useMutation({
    onSuccess: async () => {
      toast.success("Property added successfully");
      await utils.property.getAll.invalidate();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to add property");
    },
  });

  const { mutateAsync: updateProperty } = api.property.edit.useMutation({
    onSuccess: async () => {
      toast.success("Property updated successfully");
      await utils.property.getAll.invalidate();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update property");
    },
  });

  // Set form values when editing and property data changes
  useEffect(() => {
    if (editMode && propertyToEdit) {
      form.reset({
        name: propertyToEdit.name ?? "",
        address: propertyToEdit.address ?? "",
        city: propertyToEdit.city ?? "",
        state: propertyToEdit.state ?? "",
        zip: propertyToEdit.zip ?? "",
        note: propertyToEdit.note ?? "",
        assetType: propertyToEdit.assetType,
        model: propertyToEdit.model,
      });
    }
  }, [editMode, propertyToEdit, form]);

  const onSubmit = async (data: PropertyInput) => {
    setOpen(false);
    try {
      if (editMode && propertyToEdit) {
        await updateProperty({
          id: propertyToEdit.id,
          data,
        });
      } else {
        await addProperty(data);
      }
      // Only reset the form for new property creation
      if (!editMode) {
        form.reset();
      }
    } catch (error) {
      console.error(
        `Error ${editMode ? "updating" : "creating"} property`,
        error,
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.clearErrors();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <div className="flex w-full justify-end">
            <PropertyFormTrigger editMode={editMode} />
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[98vh] rounded-xl text-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {editMode ? "Edit Property" : "Add Property"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <PropertyFormFields control={form.control} />
          </form>
          <DialogFooter>
            <Button
              size="sm"
              type="button"
              className="cursor-pointer"
              onClick={form.handleSubmit(onSubmit)}
            >
              {editMode ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
