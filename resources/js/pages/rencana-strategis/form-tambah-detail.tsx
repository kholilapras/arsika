import { useForm } from "@inertiajs/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function FormTambahTarget({ indikatorId, onSuccess }: { indikatorId: number, onSuccess?: () => void }) {
    const { data, setData, post, processing, reset } = useForm({
        renstra_indikator_id: indikatorId,
        tahun: "",
        target: "",
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post(route("detail.store"), {
            onSuccess: () => {
                reset()
                onSuccess?.()   // ✅ Tutup dialog setelah sukses
            },
        })
    }

    return (
        <form onSubmit={submit}>
            <div>
                <Label>Tahun</Label>
                <Input type="number" value={data.tahun} onChange={e => setData("tahun", e.target.value)} />
            </div>
            <div>
                <Label>Target</Label>
                <Input value={data.target} onChange={e => setData("target", e.target.value)} />
            </div>
            <div className="pt-4">
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button type="submit" disabled={processing}>Simpan</Button>
                </DialogFooter>
            </div>
        </form>
    )
}
