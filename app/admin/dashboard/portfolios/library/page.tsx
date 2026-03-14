"use client"
import { Loader2, Plus, Upload } from "lucide-react"
import { AdminSidebar, AdminSidebarToggleButton } from "@/components/admin/sidebar"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const categories = {
    "Technology": "",
    "Automotive": "",
    "Feshion and Beauty": "",
    "Food Industry": "",
    "Healthcare": "",
    "Environment": "",
}



export default function Portfolio() {
    const [loading, setLoading] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState([]);

    function uploadFile() {
        const fileTag = document.createElement("input");
        fileTag.type = "file";
        fileTag.multiple = true;
        fileTag.style.display = "none";

        document.body.appendChild(fileTag);

        fileTag.addEventListener("change", async () => {
            if (!fileTag.files) return;

            const newFiles = Array.from(fileTag.files).map(file => ({
                name: file.name,
                size: file.size,
            }));

            await uploadFiles(fileTag.files[0])

            setUploadedFiles(prev => [...prev, ...newFiles]);

            // Remove AFTER files are selected
            document.body.removeChild(fileTag);
        });

        fileTag.click();
    }


    async function uploadFiles(file: any) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log(data);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen  items-center justify-center bg-background">
                <AdminSidebar />
                <main className="flex-1 items-center justify-center flex flex-col">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <span>Loading events...</span>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex justify-start max-h-[80vh] overflow-hidden">
            <AdminSidebar />
            <main className="w-full p-2 md:p-8 lg:p-8 lg:pt-0 overflow-y-auto">
                <div className="mb-3 pt-4">
                    <div className="flex items-center justify-between mb-3 w-full">
                        <div>
                            <h1 className="text-3xl font-serif text-foreground">
                                <AdminSidebarToggleButton />
                                Manage Portfolios Library
                            </h1>
                            <p>Manage your portfolio and categoies.</p>
                        </div>
                        <div>
                            <Button onClick={uploadFile}><Upload /> Upload</Button>
                        </div>
                    </div>
                </div>

                <div>
                </div>

                <div className="flex flex-col gap-3">
                    {uploadedFiles.map((item) => (
                        <span key={item?.name}>{item?.name}</span>
                    ))}
                </div>

            </main>
        </div>
    )
}