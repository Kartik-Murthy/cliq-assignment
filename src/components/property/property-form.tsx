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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  assetTypes,
  modelTypes,
  propertyInputSchema,
  type Property,
  type PropertyInput,
} from "@/lib/types";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface PropertyFormProps {
  editMode?: boolean;
  propertyToEdit?: Property;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const PropertyForm = ({
  editMode = false,
  propertyToEdit,
  onSuccess,
  trigger,
}: PropertyFormProps) => {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  // Add property mutation
  const { mutateAsync: addProperty } = api.property.create.useMutation({
    onSuccess: async () => {
      toast.success("Property added successfully");
      await utils.property.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to add property");
      console.error("Failed to create property", error);
    },
  });

  // Update property mutation
  const { mutateAsync: updateProperty } = api.property.edit.useMutation({
    onSuccess: async () => {
      toast.success("Property updated successfully");
      await utils.property.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to update property");
      console.error("Failed to update property", error);
    },
  });

  const form = useForm<PropertyInput>({
    resolver: zodResolver(propertyInputSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      note: "",
      assetType: undefined,
      model: undefined,
    },
  });

  // Set form values when editing and property data changes
  useEffect(() => {
    if (editMode && propertyToEdit) {
      form.reset({
        name: propertyToEdit?.name ?? "",
        address: propertyToEdit?.address ?? "",
        city: propertyToEdit?.city ?? "",
        state: propertyToEdit?.state ?? "",
        zip: propertyToEdit?.zip ?? "",
        note: propertyToEdit?.note ?? "",
        assetType: assetTypes.find((type) => type === propertyToEdit.assetType),
        model: modelTypes.find((type) => type === propertyToEdit.model),
      });
    }
  }, [editMode, propertyToEdit, form]);

  const onSubmit: SubmitHandler<PropertyInput> = async (data) => {
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
    } catch (error) {
      console.error(
        `Error ${editMode ? "updating" : "creating"} property`,
        error,
      );
    } finally {
      form.reset();
    }
  };

  // Default trigger if none is provided
  const defaultTrigger = editMode ? (
    <Button variant="outline" size="sm" className="cursor-pointer">
      <Pencil className="h-4 w-4 text-blue-600" />
    </Button>
  ) : (
    (trigger ?? (
      <Button className="h-6 w-6 cursor-pointer rounded-full" size="icon">
        <Plus strokeWidth={2.5} />
      </Button>
    ))
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.clearErrors();
          if (!editMode) {
            form.reset();
          }
        }
      }}
    >
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>

      <DialogContent className="max-h-[98vh] rounded-xl text-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {editMode ? "Edit Property" : "Add Property"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-h-[75vh] w-full space-y-3 overflow-y-auto rounded-lg border border-gray-200 p-3"
            style={{ scrollbarWidth: "thin" }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Property Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Property Name"
                      className="hover:bg-accent hover:text-accent-foreground focus:bg-background h-8 text-sm focus:text-black"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Asset Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="hover:bg-accent hover:text-accent-foreground h-8 w-full cursor-pointer text-sm">
                        <SelectValue placeholder="Select Asset Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        className="cursor-pointer"
                        value="Multifamily"
                      >
                        Multifamily
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Office">
                        Office
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Retail">
                        Retail
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Industrial">
                        Industrial
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="hover:bg-accent hover:text-accent-foreground h-8 w-full cursor-pointer text-sm">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="Standard">
                        Standard
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Premium">
                        Premium
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Luxury">
                        Luxury
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Custom">
                        Custom
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Address"
                      className="hover:bg-accent hover:text-accent-foreground h-8 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="City"
                      className="hover:bg-accent hover:text-accent-foreground focus:bg-background h-8 text-sm focus:text-black"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">State</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="State"
                        className="hover:bg-accent hover:text-accent-foreground focus:bg-background h-8 text-sm focus:text-black"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">ZIP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ZIP Code"
                        className="hover:bg-accent hover:text-accent-foreground focus:bg-background h-8 text-sm focus:text-black"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Note</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Optional note"
                      className="hover:bg-accent hover:text-accent-foreground focus:bg-background text-sm focus:text-black"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </form>
          <DialogFooter>
            <Button
              size="sm"
              type="button"
              className="cursor-pointer"
              onClick={form.handleSubmit(onSubmit)}
            >
              {editMode ? "Update" : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                setOpen(false);
                form.clearErrors();
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;
