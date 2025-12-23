import React from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Info, Trash } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useForm } from "@inertiajs/react"
import ChevronToggle from "@/components/ui/chevron-toggle"
import FormIndikator from "../rencana-strategis/form-indikator"
import formatTanggal from "../../utils/formatTanggal"

interface OpsiIndikatorProps {
    indikator: any
    openRow: number | null
    setOpenRow: (id: number | null) => void
    editData: any | null
    setEditData: (data: any | null) => void
}

export default function OpsiIndikator({
    indikator,
    openRow,
    setOpenRow,
    editData,
    setEditData,
}: OpsiIndikatorProps) {
    const { delete: destroy } = useForm()

    return (
        <div className="flex items-center gap-2">
            {/* Edit */}
            <Dialog open={editData?.id === indikator.id} onOpenChange={(o) => !o && setEditData(null)}>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditData(indikator)
                        }}
                    >
                        <Pencil />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    {editData && (
                        <FormIndikator indikator={editData} onSuccess={() => setEditData(null)} />
                    )}
                </DialogContent>
            </Dialog>

            {/* Detail Info */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary"><Info /></Button>
                </DialogTrigger>
                <DialogContent>
                    
                    <p><strong>Dibuat : </strong> {formatTanggal(indikator.created_at)}</p>
                    <p><strong>Diperbarui : </strong> {formatTanggal(indikator.updated_at)}</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Trash />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus <strong>{indikator.indikator}</strong>?
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button
                            onClick={() => destroy(route("indikator.destroy", indikator.id))}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Toggle Detail */}
            <span
                onClick={(e) => {
                    e.stopPropagation()
                    setOpenRow(openRow === indikator.id ? null : indikator.id)
                }}
            >
                <ChevronToggle open={openRow === indikator.id} />
            </span>
        </div>
    )
}
