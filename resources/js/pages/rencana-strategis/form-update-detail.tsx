import { useForm, router } from "@inertiajs/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"

export default function FormIsiCapaian({ detailId }: { detailId: number }) {
    const { data, setData, processing, reset } = useForm<{
        capaian: string
        dokumen?: File
    }>({
        capaian: "",
        dokumen: undefined,
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        console.log("📤 Data yang dikirim:", data) // log sebelum dikirim

        router.post(route("detail.update", detailId), {
            _method: "put",   // spoofing untuk Laravel
            ...data,          // spread supaya capaian & dokumen ikut terkirim
        }, {
            forceFormData: true,
            onSuccess: () => {
                console.log("✅ Data berhasil dikirim dan diproses server")
                reset()
                router.reload({ only: ["DaftarIndikator"] })
            },
            onError: (errors) => {
                console.error("❌ Gagal update:", errors)
            },
            onFinish: () => {
                console.log("ℹ️ Request selesai")
            },
        })

    }


    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label>Capaian</label>
                <Input
                    value={data.capaian}
                    onChange={(e) => setData("capaian", e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Dokumen (PDF)</label>
                <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setData("dokumen", e.target.files?.[0])}
                />
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
                <Button
                    type="submit"
                    disabled={processing || !data.capaian.trim()}
                >
                    {processing ? "Menyimpan..." : "Simpan"}
                </Button>
            </DialogFooter>
        </form>
    )
}
