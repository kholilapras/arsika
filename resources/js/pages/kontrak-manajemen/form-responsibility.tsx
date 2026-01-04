import * as React from "react"
import { useForm } from "@inertiajs/react"
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Responsibility = {
    id?: number | string
    responsibility: string
    kpi_spesifik: string
    unit: string
    tahun: string
}

interface FormResponsibilityProps {
    indikator?: Partial<Responsibility>
    onSuccess?: () => void
}

type ClientErrors = Partial<Record<keyof Responsibility, string>>

export default function FormResponsibility({ indikator, onSuccess }: FormResponsibilityProps) {
    const isEdit = !!indikator?.id

    const { data, setData, post, put, processing, errors, clearErrors, reset } = useForm<Responsibility>({
        responsibility: indikator?.responsibility ?? "",
        kpi_spesifik: indikator?.kpi_spesifik ?? "",
        unit: indikator?.unit ?? "",
        tahun: indikator?.tahun ?? "",
        id: indikator?.id,
    })

    const [clientErrors, setClientErrors] = React.useState<ClientErrors>({})

    React.useEffect(() => {
        setClientErrors({})
        clearErrors()
        setData({
            responsibility: indikator?.responsibility ?? "",
            kpi_spesifik: indikator?.kpi_spesifik ?? "",
            unit: indikator?.unit ?? "",
            tahun: indikator?.tahun ?? "",
            id: indikator?.id,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [indikator?.id])

    const validate = (payload: Responsibility): ClientErrors => {
        const e: ClientErrors = {}

        const r = payload.responsibility.trim()
        const k = payload.kpi_spesifik.trim()
        const u = payload.unit.trim()
        const t = payload.tahun.trim()

        if (!r) e.responsibility = "Responsibility wajib diisi."
        if (!k) e.kpi_spesifik = "KPI Spesifik wajib diisi."
        if (!u) e.unit = "Unit wajib diisi."

        if (!t) {
            e.tahun = "Tahun wajib diisi."
        } else if (!/^\d{4}$/.test(t)) {
            e.tahun = "Tahun harus 4 digit (contoh: 2025)."
        } else {
            const year = Number(t)
            if (Number.isNaN(year)) e.tahun = "Tahun harus angka."
            else if (year < 2000 || year > 2100) e.tahun = "Tahun harus antara 2000 - 2100."
        }

        return e
    }

    const setField = (key: keyof Responsibility, value: string) => {
        setClientErrors((prev) => ({ ...prev, [key]: undefined }))
        clearErrors(key as any)
        setData(key, value as any)
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        const eClient = validate(data)
        setClientErrors(eClient)
        const hasClientError = Object.values(eClient).some(Boolean)
        if (hasClientError) return

        if (isEdit) {
            put(route("kontrak-manajemen.responsibility.update", indikator!.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.()
                },
            })
            return
        }

        post(route("kontrak-manajemen.responsibility.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                onSuccess?.()
            },
        })
    }

    const err = (k: keyof Responsibility) => clientErrors[k] || (errors as any)[k]

    return (
        <form onSubmit={submit} className="space-y-5">
            <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Responsibility" : "Tambah Responsibility"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="responsibility">Responsibility</Label>
                    <Input
                        id="responsibility"
                        value={data.responsibility}
                        onChange={(e) => setField("responsibility", e.target.value)}
                    />
                    {err("responsibility") ? <p className="text-sm">{err("responsibility")}</p> : null}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="kpi_spesifik">KPI Spesifik</Label>
                    <Input
                        id="kpi_spesifik"
                        value={data.kpi_spesifik}
                        onChange={(e) => setField("kpi_spesifik", e.target.value)}
                    />
                    {err("kpi_spesifik") ? <p className="text-sm">{err("kpi_spesifik")}</p> : null}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                        id="unit"
                        value={data.unit}
                        onChange={(e) => setField("unit", e.target.value)}
                    />
                    {err("unit") ? <p className="text-sm">{err("unit")}</p> : null}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="tahun">Tahun</Label>
                    <Input
                        id="tahun"
                        type="number"
                        inputMode="numeric"
                        placeholder="Contoh: 2025"
                        value={data.tahun}
                        onChange={(e) => setField("tahun", e.target.value)}
                    />
                    {err("tahun") ? <p className="text-sm">{err("tahun")}</p> : null}
                </div>
            </div>

            <DialogFooter className="mt-2 gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={processing}>
                        Batal
                    </Button>
                </DialogClose>

                <Button type="submit" disabled={processing}>
                    {processing ? "Memproses..." : isEdit ? "Perbarui" : "Simpan"}
                </Button>
            </DialogFooter>
        </form>
    )
}
