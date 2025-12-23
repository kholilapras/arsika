import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Info, Trash } from "lucide-react"
import { router } from "@inertiajs/react"
import formatTanggal from "../../utils/formatTanggal"

interface OpsiDetailProps {
    indikator: any
    item: any
}

export default function OpsiDetail({ indikator, item }: OpsiDetailProps) {
    return (
        <div className="flex gap-2">
            {/* Tombol Info (timestamp) */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary"><Info /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Informasi Detail</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <div className="space-y-2">
                            <p>Dibuat: {formatTanggal(item.created_at)}</p>
                            <p>Diperbarui:{formatTanggal(item.updated_at)}</p>
                        </div>
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Tutup</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Tombol Hapus */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary"><Trash /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus
                        <strong> {indikator.indikator} tahun {item.tahun}</strong>?
                    </DialogDescription>
                    <DialogFooter className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>

                        <Button
                            variant="destructive"
                            onClick={() => {
                                router.delete(route("detail.destroy", item.id), {
                                    preserveScroll: true,
                                })
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
