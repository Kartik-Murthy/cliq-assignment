import { assetTypes, modelTypes } from "@/lib/constants";
import { type PropertyInput } from "@/lib/types";
import { type Control } from "react-hook-form";
import {
  FormInputField,
  FormSelectField,
  FormTextareaField,
} from "./fields/index";

interface PropertyFormFieldsProps {
  control: Control<PropertyInput>;
}

export function PropertyFormFields({ control }: PropertyFormFieldsProps) {
  return (
    <div
      className="max-h-[75vh] w-full space-y-3 overflow-y-auto rounded-lg border border-gray-200 p-3"
      style={{ scrollbarWidth: "thin" }}
    >
      <FormInputField
        control={control}
        name="name"
        label="Property Name"
        placeholder="Property Name"
      />

      <FormSelectField
        control={control}
        name="assetType"
        label="Asset Type"
        options={assetTypes.map((type) => type)}
        placeholder="Select Asset Type"
      />

      <FormSelectField
        control={control}
        name="model"
        label="Model"
        options={modelTypes.map((type) => type)}
        placeholder="Select Model"
      />

      <FormInputField
        control={control}
        name="address"
        label="Address"
        placeholder="Address"
      />

      <FormInputField
        control={control}
        name="city"
        label="City"
        placeholder="City"
      />

      <div className="grid grid-cols-2 gap-2">
        <FormInputField
          control={control}
          name="state"
          label="State"
          placeholder="State"
        />

        <FormInputField
          control={control}
          name="zip"
          label="ZIP"
          placeholder="ZIP Code"
        />
      </div>

      <FormTextareaField
        control={control}
        name="note"
        label="Note"
        placeholder="Optional note"
        rows={2}
      />
    </div>
  );
}
