"use client";

import { useState, useEffect } from "react";

interface CreateEventModalProps {
    isOpen: boolean;
    isEditMode: boolean;
    onClose: () => void;
    onSubmit: (data: EventFormData, updatedAt: any) => void;
    event?: EventFormData | null;
}

export interface EventFormData {
    category: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    attendees: string;
    bookingDeadline: string;
    image: string
}

const initialState: EventFormData = {
    category: "",
    title: "",
    startDate: "",
    endDate: "",
    location: "",
    attendees: "",
    bookingDeadline: "",
    image: ""
};

export default function AddEvent({
    isOpen,
    isEditMode,
    onClose,
    onSubmit,
    event = null,
}: CreateEventModalProps) {
    const [formData, setFormData] = useState<EventFormData>(initialState);

    // 🔥 Prefill when editing
    useEffect(() => {
        if (event) {
            setFormData(event);
        } else {
            setFormData(initialState);
        }
    }, [event, isOpen]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit(formData, Date.now()); // Let parent handle create/update
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border w-full max-w-2xl rounded-2xl p-6 shadow-xl overflow-auto">

                <h2 className="text-xl font-semibold mb-4">
                    {isEditMode ? "Edit Event" : "Create New Event"}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                    <div className="flex col-span-2 gap-1 flex-wrap flex-reverce">
                        <div className="flex flex-col me-auto gap-2 w-sm">
                            <div className="flex gap-2 items-start bordker w-full rounded flex-col">
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

                        </div>
                        <div className="shadow-lg w-52 max-h-42 overflow-hidden object-contain items-center flex justify-center bg-background border rounded relative">
                            {!formData?.image && <span className="text-gray-500">Image Preview</span>}
                            {formData?.image && <img src={formData?.image || ""} className="rounded" />}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Event Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="p-2 rounded bg-[#111]"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">

                        <label className="text-gray-400 text-sm">Event end Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="p-2 rounded bg-[#111]"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Event Vanue</label>
                        <input
                            name="location"
                            placeholder="Location (e.g., Las Vegas, USA)"
                            value={formData.location}
                            onChange={handleChange}
                            className="col-span-2 p-2 rounded bg-[#111]"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Expected Attendees</label>
                        <input
                            name="attendees"
                            placeholder="Expected Attendees (e.g., 180000)"
                            value={formData.attendees}
                            onChange={handleChange}
                            className="p-2 rounded bg-[#111]"
                        />
                    </div>

                    <div className="flex flex-col gap-2">

                        <label className="text-gray-400 text-sm">Book By till end</label>
                        <input
                            type="month"
                            name="bookingDeadline"
                            value={formData.bookingDeadline}
                            onChange={handleChange}
                            className="p-2 rounded bg-[#111]"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm">Event Image</label>
                        <input
                            type="url"
                            name="image"
                            value={formData?.image}
                            onChange={handleChange}
                            className="p-2 rounded bg-[#111] col-span-2"
                            placeholder="https://verluxstands/newevent.png"
                        />
                    </div>
                    <div className="col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(initialState);
                                onClose();
                            }}
                            className="px-4 py-2 rounded bg-[#222] hover:bg-[#333]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-yellow-500 text-black font-medium hover:bg-yellow-400"
                        >
                            {isEditMode ? "Update Event" : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}