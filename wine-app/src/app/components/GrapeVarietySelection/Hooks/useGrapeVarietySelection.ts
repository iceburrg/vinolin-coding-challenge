"use client"
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import grapeVarietiesSelections from "@/app/model/grapeVarietiesSelections.json";
import { validationSchema } from "@/app/components/GrapeVarietySelection/GrapeVarietySelection.validations";
import { FormValues, GrapeVariety } from "@/app/components/GrapeVarietySelection/GrapeVarietySelection.types";

const useGrapeVarietySelection = () => {
    const [savingMessage, setSavingMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (savingMessage) {
            const timer = setTimeout(() => {
                setSavingMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [savingMessage]);

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
                    setSavingMessage({ text: "Ausgewählte Rebsorten wurden erfolgreich gespeichert!", type: 'success' });
                } else {
                    setSavingMessage({ text: "Fehler beim Speichern: " + result.error, type: 'error' });
                }
            } catch (error) {
                setSavingMessage({ text: "Ein unerwarteter Fehler ist aufgetreten.", type: 'error' });
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

    return { formik, savingMessage, isSelected, handleGrapeVarietySelection, handleGrapeVarietyPercentageChange };
};

export default useGrapeVarietySelection;