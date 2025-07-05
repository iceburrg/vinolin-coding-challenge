"use client";
import { useFormik } from "formik";
import grapeVarietiesData from "@/app/model/grapeVarieties.json";
import grapeVarietiesSelections from "@/app/model/grapeVarietiesSelections.json";
import { validationSchema } from "./GrapeVarietySelection.validations";

interface GrapeVariety {
  name: string;
  percentage?: number | null;
}

interface FormValues {
  selectedVarieties: GrapeVariety[];
}

const grapeVarieties: string[] = Object.values(grapeVarietiesData);

const GrapeVarietySelection = () => {

    const getInitialData = (): GrapeVariety[] => {
        if (grapeVarietiesSelections?.selectedVarieties) {
            return grapeVarietiesSelections.selectedVarieties;
        }
        return [];
    };

    const formik = useFormik<FormValues>({
        initialValues: { selectedVarieties: getInitialData() },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values: FormValues) => {
            try {
                const response = await fetch("/api/save-grape-varieties", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values.selectedVarieties),
                });

                const result = await response.json();

                if (result.success) {
                    alert("Ausgewählte Rebsorten wurden erfolgreich gespeichert!");
                } else {
                    alert("Fehler beim Speichern: " + result.error);
                }
            } catch (error) {
                console.error("Error saving data:", error);
            }
        },
    });

    const isSelected = (name: string): boolean =>
        formik.values.selectedVarieties.some((v) => v.name === name);

    const handleGrapeVarietySelection = (name: string): void => {
        if (isSelected(name)) {
            formik.setFieldValue(
                "selectedVarieties",
                formik.values.selectedVarieties.filter((v) => v.name !== name)
            );
        } else {
            formik.setFieldValue(
                "selectedVarieties",
                [...formik.values.selectedVarieties, { name, percentage: null }]
            );
        }
    };

    const handleGrapeVarietyPercentageChange = (name: string, value: string): void => {
        formik.setFieldValue(
            "selectedVarieties",
            formik.values.selectedVarieties.map((variety) =>
                variety.name !== name ? variety : { ...variety, percentage: value === "" ? null : Number(value) }
            )
        );
    };

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-row justify-between w-full px-48 py-12">
            <div className="flex flex-col gap-1">
                {grapeVarieties.map((grapeVariety: string) => (
                    <div key={grapeVariety} className="flex flex-row justify-between gap-4">
                        <label>{grapeVariety}</label>
                        <div className="flex flex-row gap-2">
                            {isSelected(grapeVariety) && (
                                <input
                                    type="text"
                                    value={formik.values.selectedVarieties.find((v) => v.name === grapeVariety)?.percentage ?? ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGrapeVarietyPercentageChange(grapeVariety, e.target.value) }
                                    className="w-12 text-center border-1 border-gray-300 rounded-md"
                                />
                            )}
                            <input
                                type="checkbox"
                                checked={isSelected(grapeVariety)}
                                onChange={() => handleGrapeVarietySelection(grapeVariety)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col">
                <div className="text-2xl font-bold mb-4">Ausgewählte Rebsorten</div>
                {formik.values.selectedVarieties.map((variety: GrapeVariety) => (
                    <div key={variety.name}>
                        {variety.name} {variety.percentage ? `${variety.percentage}%` : ''}
                    </div>
                ))}
                <div className="flex flex-col gap-1">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">Speichern</button>
                    {formik.errors.selectedVarieties && typeof formik.errors.selectedVarieties === "string" && (
                        <div className="text-red-600 text-xs">{formik.errors.selectedVarieties}</div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default GrapeVarietySelection;