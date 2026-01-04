import React, { useEffect } from "react"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Props = {
    responsibilityId?: number | string
    detail?: any // kalau ada -> mode edit
    onSuccess?: () => void
}

export default function FormTambahDetail({ responsibilityId, detail, onSuccess }: Props) {
    const isEdit = !!detail

    const { data, setData, post, put, processing, errors, reset } = useForm({
        km_responsibility_id: detail?.km_responsibility_id ?? responsibilityId ?? "",
        tw_km: detail?.tw_km ?? detail?.tw ?? "",
        bobot_km: detail?.bobot_km ?? detail?.bobot ?? "",
        target_km: detail?.target_km ?? detail?.target ?? "",
    })

    // ✅ pastikan FK selalu terisi saat mode tambah
    useEffect(() => {
        if (!isEdit) {
            setData("km_responsibility_id", responsibilityId ?? "")
        }
    }, [responsibilityId])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEdit) {
            // ✅ route sesuai route:list: kontrak-manajemen.detail.update
            put(route("kontrak-manajemen.detail.update", detail.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.()
                },
                onError: (errs) => {
                    console.log("VALIDATION ERROR (UPDATE DETAIL):", errs)
                },
            })
            return
        }

        // ✅ route sesuai route:list: kontrak-manajemen.detail.store
        post(route("kontrak-manajemen.detail.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                onSuccess?.()
            },
            onError: (errs) => {
                console.log("VALIDATION ERROR (STORE DETAIL):", errs)
            },
        })
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Detail" : "Tambah Detail"}</DialogTitle>
            </DialogHeader>

            {/* hidden fk (tetap dikirim karena ada di data useForm) */}
            <input type="hidden" name="km_responsibility_id" value={String(data.km_responsibility_id ?? "")} />

            <div className="space-y-2">
                <Label>Triwulan (TW)</Label>
                <Select value={data.tw_km} onValueChange={(v) => setData("tw_km", v)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih TW" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TW 1">TW 1</SelectItem>
                        <SelectItem value="TW 2">TW 2</SelectItem>
                        <SelectItem value="TW 3">TW 3</SelectItem>
                        <SelectItem value="TW 4">TW 4</SelectItem>
                    </SelectContent>
                </Select>
                {errors.tw_km ? <p className="text-sm text-red-500">{errors.tw_km}</p> : null}
            </div>

            <div className="space-y-2">
                <Label>Bobot</Label>
                <Input
                    type="text"
                    placeholder="Contoh: 25% / 0.25 / 25"
                    value={data.bobot_km}
                    onChange={(e) => setData("bobot_km", e.target.value)}
                />
                {errors.bobot_km ? <p className="text-sm text-red-500">{errors.bobot_km}</p> : null}
            </div>

            <div className="space-y-2">
                <Label>Target</Label>
                <Input
                    type="text"
                    placeholder="Contoh: 80 / 10 dokumen / dst"
                    value={data.target_km}
                    onChange={(e) => setData("target_km", e.target.value)}
                />
                {errors.target_km ? <p className="text-sm text-red-500">{errors.target_km}</p> : null}
            </div>

            <DialogFooter className="gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={processing}>
                        Batal
                    </Button>
                </DialogClose>

                <Button type="submit" disabled={processing || !data.km_responsibility_id}>
                    {processing ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
                </Button>
            </DialogFooter>
        </form>
    )
}
