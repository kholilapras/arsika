import { useForm } from "@inertiajs/react"
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormIndikatorProps {
  indikator?: any
  onSuccess?: () => void
}

export default function FormIndikator({ indikator, onSuccess }: FormIndikatorProps) {
  const isEdit = !!indikator

  const { data, setData, post, put, processing, reset } = useForm({
    main_program: indikator?.main_program || "",
    indikator: indikator?.indikator || "",
    bidang: indikator?.bidang || "",
    tipe_data: indikator?.tipe_data || "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit) {
      put(route("indikator.update", indikator.id), {
        onSuccess: () => {
          reset()
          onSuccess?.()
        },
      })
    } else {
      post(route("indikator.store"), {
        onSuccess: () => {
          reset()
          onSuccess?.()
        },
      })
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Indikator" : "Tambah Indikator"}</DialogTitle>
      </DialogHeader>

      <Label>Main Program</Label>
      <Input
        value={data.main_program}
        onChange={(e) => setData("main_program", e.target.value)}
      />

      <Label>Indikator</Label>
      <Textarea
        value={data.indikator}
        onChange={(e) => setData("indikator", e.target.value)}
      />

      <Label>Bidang</Label>
      <Input
        value={data.bidang}
        onChange={(e) => setData("bidang", e.target.value)}
      />

      <Label>Unit</Label>
      <Input
        value={data.tipe_data}
        onChange={(e) => setData("tipe_data", e.target.value)}
      />

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline">Batal</Button>
        </DialogClose>
        <Button type="submit" disabled={processing}>
          {isEdit ? "Perbarui" : "Simpan"}
        </Button>
      </DialogFooter>
    </form>
  )
}
