import React from "react"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Props = {
    detailId: number | string
    detail?: any
    onSuccess?: () => void
}

export default function FormIsiRealisasi({ detailId, detail, onSuccess }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        realisasi_km: string
        dokumen: File | null
        _method: "PUT"
    }>({
        realisasi_km: detail?.realisasi_km ?? detail?.realisasi ?? "",
        dokumen: null,
        _method: "PUT",
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        // ✅ route sesuai route:list
        post(route("kontrak-manajemen.detail.update", detailId), {
            preserveScroll: true,
            forceFormData: true, // ✅ biar file terkirim
            onSuccess: () => {
                reset("dokumen")
                onSuccess?.()
            },
            onError: (errs) => {
                console.log("VALIDATION ERROR:", errs)
            },
        })
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <DialogHeader>
                <DialogTitle>Isi Realisasi</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
                <Label>Realisasi</Label>
                <Input
                    type="text"
                    placeholder="Masukkan realisasi..."
                    value={data.realisasi_km}
                    onChange={(e) => setData("realisasi_km", e.target.value)}
                />
                {errors.realisasi_km ? <p className="text-sm text-red-500">{errors.realisasi_km}</p> : null}
            </div>

            <div className="space-y-2">
                <Label>Upload Dokumen (PDF, max 20MB)</Label>
                <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setData("dokumen", e.target.files?.[0] ?? null)}
                />
                {errors.dokumen ? <p className="text-sm text-red-500">{errors.dokumen}</p> : null}

                {(detail?.nama_dokumen_km || detail?.nama_dokumen) ? (
                    <p className="text-sm text-muted-foreground">
                        Dokumen saat ini:{" "}
                        <span className="font-medium">{detail?.nama_dokumen_km ?? detail?.nama_dokumen}</span>
                    </p>
                ) : null}
            </div>

            <DialogFooter className="gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={processing}>
                        Batal
                    </Button>
                </DialogClose>

                <Button type="submit" disabled={processing}>
                    {processing ? "Menyimpan..." : "Simpan"}
                </Button>
            </DialogFooter>
        </form>
    )
}
