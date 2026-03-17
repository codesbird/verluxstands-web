"use client";

import { useEffect, useMemo, useState } from "react";

interface CreateEventModalProps {
    isOpen: boolean;
    isEditMode: boolean;
    onClose: () => void;
    onSubmit: (data: EventFormData, updatedAt: number) => void | Promise<void>;
    event?: EventFormData | null;
    submitting?: boolean;
    uploadProgress?: number;
}

export interface EventFormData {
    category: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    attendees: string;
    bookingDeadline: string;
    image: string;
    imageMediaId?: string;
    imageFile?: File | null;
    status: string;
}

const initialState: EventFormData = {
    category: "",
    title: "",
    startDate: "",
    endDate: "",
    location: "",
    attendees: "",
    bookingDeadline: "",
    image: "",
    imageMediaId: "",
    imageFile: null,
    status: "draft"
};

export default function AddEvent({
    isOpen,
    isEditMode,
    onClose,
    onSubmit,
    event = null,
    submitting = false,
    uploadProgress = 0,
}: CreateEventModalProps) {
    const [formData, setFormData] = useState<EventFormData>(initialState);

    useEffect(() => {
        if (event) {
            setFormData({ ...initialState, ...event, imageFile: null });
        } else {
            setFormData(initialState);
        }
    }, [event, isOpen]);

    const previewUrl = useMemo(() => {
        if (formData.imageFile) {
            return URL.createObjectURL(formData.imageFile);
        }
        return formData.image || "";
    }, [formData.image, formData.imageFile]);

    useEffect(() => {
        return () => {
            if (formData.imageFile && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [formData.imageFile, previewUrl]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({
            ...prev,
            imageFile: file,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, Date.now());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border w-full max-w-2xl rounded-2xl p-6 shadow-xl overflow-auto max-h-[92vh]">
                <h2 className="text-xl font-semibold mb-4">
                    {isEditMode ? "Edit Event" : "Create New Event"}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex gap-3 flex-wrap">
                        <div className="flex flex-col me-auto gap-2 w-full max-w-[28rem]">
                            <label className="text-gray-400 text-sm">Event Category</label>
                            <input
                                name="category"
                                placeholder="Category (e.g., Technology)"
                                value={formData.category}
                                onChange={handleChange}
                                className="p-2 w-full rounded bg-[#111]"
                                required
                            />
                            <label className="text-gray-400 text-sm">Event Title</label>
                            <input
                                name="title"
                                placeholder="Event Title (e.g., CES 2026)"
                                value={formData.title}
                                onChange={handleChange}
                                className="p-2 w-full rounded bg-[#111]"
                                required
                            />
                        </div>
                        <div className="shadow-lg w-52 h-40 overflow-hidden object-contain items-center flex justify-center bg-background border rounded relative">
                            {!previewUrl && <span className="text-gray-500">Image Preview</span>}
                            {previewUrl && <img src={previewUrl} className="rounded h-full w-full object-cover" alt="Event preview" />}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Event Start Date</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="p-2 rounded bg-[#111]" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Event End Date</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="p-2 rounded bg-[#111]" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Event Venue</label>
                        <input name="location" placeholder="Location (e.g., Las Vegas, USA)" value={formData.location} onChange={handleChange} className="col-span-2 p-2 rounded bg-[#111]" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Expected Attendees</label>
                        <input name="attendees" placeholder="Expected Attendees (e.g., 180000)" value={formData.attendees} onChange={handleChange} className="p-2 rounded bg-[#111]" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Book By</label>
                        <input type="month" name="bookingDeadline" value={formData.bookingDeadline} onChange={handleChange} className="p-2 rounded bg-[#111]" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Event Image</label>
                        <input
                            type="file"
                            name="imageFile"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="p-2 rounded bg-[#111] col-span-2 file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-2 file:text-black"
                        />
                        <p className="text-xs text-white/50">Upload a cover image. Replacing the image will remove the old uploaded file after save.</p>
                        {submitting && uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                            </div>
                        )}
                    </div>

                    <div className="col-span-2 flex justify-end gap-3 mt-4 border-t pt-2">
                        <div className="me-auto">
                            <span className="text-white/70">Event is:- </span>
                            <select className="bg-background text-primary" name="status" value={formData.status || "draft"} onChange={handleChange}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setFormData(initialState);
                                onClose();
                            }}
                            className="px-4 py-2 rounded bg-[#222] hover:bg-[#333]"
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded bg-yellow-500 text-black font-medium hover:bg-yellow-400 disabled:opacity-60"
                        >
                            {submitting ? "Saving..." : isEditMode ? "Update Event" : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
