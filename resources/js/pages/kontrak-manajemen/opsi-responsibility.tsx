import React from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Info, Trash, MoreVertical } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "@inertiajs/react"
import ChevronToggle from "@/components/ui/chevron-toggle"
import FormResponsibility from "./form-responsibility"
import formatTanggal from "../../utils/formatTanggal"

type ResponsibilityRow = {
    id: number | string
    responsibility: string
    kpi_spesifik: string
    unit: string
    tahun: string
    created_at?: string
    updated_at?: string
}

interface OpsiResponsibilityProps {
    responsibility: ResponsibilityRow
    openRow: number | string | null
    setOpenRow: (id: number | string | null) => void
    editData: ResponsibilityRow | null
    setEditData: (data: ResponsibilityRow | null) => void
}

export default function OpsiResponsibility({
    responsibility,
    openRow,
    setOpenRow,
    editData,
    setEditData,
}: OpsiResponsibilityProps) {
    const { delete: destroy, processing } = useForm()

    const [infoOpen, setInfoOpen] = React.useState(false)
    const [deleteOpen, setDeleteOpen] = React.useState(false)

    const isOpen = openRow === responsibility.id

    return (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* EDIT DIALOG (dibuka dari item dropdown) */}
            <Dialog open={editData?.id === responsibility.id} onOpenChange={(o) => !o && setEditData(null)}>
                <DialogContent>
                    {editData && <FormResponsibility indikator={editData} onSuccess={() => setEditData(null)} />}
                </DialogContent>
            </Dialog>

            {/* INFO DIALOG (dibuka dari item dropdown) */}
            <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Info</DialogTitle>
                    </DialogHeader>

                    <p>
                        <strong>Dibuat : </strong>{" "}
                        {responsibility.created_at ? formatTanggal(responsibility.created_at) : "-"}
                    </p>
                    <p>
                        <strong>Diperbarui : </strong>{" "}
                        {responsibility.updated_at ? formatTanggal(responsibility.updated_at) : "-"}
                    </p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE DIALOG (dibuka dari item dropdown) */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus{" "}
                        <strong>{responsibility.responsibility}</strong> tahun{" "}
                        <strong>{responsibility.tahun}</strong> ?
                    </DialogDescription>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={processing}>
                                Batal
                            </Button>
                        </DialogClose>

                        <Button
                            disabled={processing}
                            onClick={() =>
                                destroy(route("kontrak-manajemen.responsibility.destroy", responsibility.id), {
                                    preserveScroll: true,
                                    onSuccess: () => setDeleteOpen(false),
                                })
                            }
                        >
                            {processing ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DROPDOWN: Edit / Info / Delete */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Opsi"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault()
                            setEditData(responsibility)
                        }}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault()
                            setInfoOpen(true)
                        }}
                    >
                        <Info className="mr-2 h-4 w-4" />
                        Info
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onSelect={(e) => {
                            e.preventDefault()
                            setDeleteOpen(true)
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* TOGGLE DETAIL tetap terpisah */}
            <span
                onClick={(e) => {
                    e.stopPropagation()
                    setOpenRow(isOpen ? null : responsibility.id)
                }}
            >
                <ChevronToggle open={isOpen} />
            </span>
        </div>
    )
}
