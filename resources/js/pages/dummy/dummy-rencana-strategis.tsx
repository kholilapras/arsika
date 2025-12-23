import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Pencil, Info, Trash, Plus, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChevronToggle from "@/components/ui/chevron-toggle";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Kontrak Manajemen", href: "#" },
];

const kelompokKeahlian = [
    {
        id: 1,
        main_program: "Implementasi Core Values AKHLAK & HEI",
        indikator: "%",
        bidang: "DIR TUP",
        tipe_data: "Angka",
        detail: [
            { id: 1, tahun: "TW-1", target: 2, capaian: 1, status: "50%", dokumen: "link_dokumen_2024.pdf" },
            { id: 2, tahun: "TW-2", target: 4, capaian: 6, status: "150%", dokumen: "" },
             { id: 1, tahun: "TW-3", target: 2, capaian: 1, status: "50%", dokumen: "link_dokumen_2024.pdf" },
            { id: 2, tahun: "TW-4", target: 4, capaian: 6, status: "150%", dokumen: "" },
        ],
    },
];


export default function RencanaStrategis() {
    const [openRow, setOpenRow] = useState<number | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kontrak Manajemen" />
            <div className="p-4">
                <div className="flex justify-between items-center gap-4 pb-4">
                    <Input
                        type="text"
                        placeholder="Cari..."
                    />
                    <Link href="rencana-strategis-kampus/rencana-strategis-indikator/create">
                        <Button><Plus /> Tambah Indikator</Button>
                    </Link>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Responsibility</th>
                            <th>Unit</th>
                            {/* <th>Bidang</th>
                            <th>Tipe Data</th> */}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {kelompokKeahlian.map((k) => (
                            <React.Fragment key={k.id}>
                                {/* Row utama */}
                                <tr
                                    className="cursor-pointer hover:text-red-500 border-b-2"
                                    onClick={() => setOpenRow(openRow === k.id ? null : k.id)}
                                >
                                    <td>{k.id}</td>
                                    <td>{k.main_program}</td>
                                    <td>{k.indikator}</td>
                                    {/* <td>{k.bidang}</td>
                                    <td>{k.tipe_data}</td> */}
                                    <td className="kolom-opsi">
                                        <Button variant="secondary"><Info /></Button>
                                        <Link href="#edit">
                                            <Button variant="secondary"><Pencil /></Button>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="secondary"><Trash /></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    Apakah Anda yakin ingin menghapus <strong>{k.indikator} </strong> ?
                                                </DialogDescription>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Batal</Button>
                                                    </DialogClose>
                                                    <Button>Hapus</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <ChevronToggle open={openRow === k.id} />
                                    </td>

                                </tr>

                                {/* Row detail collapse */}
                                {openRow === k.id && (
                                    <tr className="table-detail">
                                        <td colSpan={6}>
                                            <div className="pb-2">
                                                <Dialog>
                                                    <form>
                                                        <DialogTrigger asChild>
                                                            <Button><Plus />Tambah Target</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Tambah Target</DialogTitle>
                                                            </DialogHeader>

                                                            <Label>Tahun</Label>
                                                            <Input type="number" />

                                                            <Label>Target</Label>
                                                            <Input />

                                                            {/* Dibuka */}
                                                            <Label className="mt-2">Dibuka</Label>
                                                            <div className="flex gap-2">
                                                                <Input type="date" className="w-1/2" />
                                                                <Input type="time" className="w-1/2" />
                                                            </div>

                                                            {/* Ditutup */}
                                                            <Label className="mt-2">Ditutup</Label>
                                                            <div className="flex gap-2">
                                                                <Input type="date" className="w-1/2" />
                                                                <Input type="time" className="w-1/2" />
                                                            </div>

                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Batal</Button>
                                                                </DialogClose>
                                                                <Button type="submit">Simpan</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </form>
                                                </Dialog>

                                            </div>
                                            {k.indikator.length > 0 ? (
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>TW</th>
                                                            <th>Bobot</th>
                                                            <th>Target</th>
                                                            {/* <th>Status</th>
                                                            <th>Dokumen</th> */}
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {k.detail.map((item, i) => (
                                                            <tr key={item.id}>
                                                                <td>{item.tahun}</td>
                                                                <td>{item.target}</td>
                                                                <td>{item.capaian}</td>
                                                                {/* <td><Badge>{item.status}</Badge></td>
                                                                <td>{item.dokumen}</td> */}
                                                                <td className="kolom-opsi">
                                                                    <Dialog>
                                                                        <form>
                                                                            <DialogTrigger asChild>
                                                                                <Button><FileText />Isi Capaian</Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent>
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Isi Capaian</DialogTitle>
                                                                                </DialogHeader>
                                                                                <Label>Bukti Dokumen <p className="text-sm text-muted-foreground">Hanya dokumen .pdf yang diizinkan</p></Label>
                                                                                <Input
                                                                                    type="file"
                                                                                    accept="application/pdf"
                                                                                />
                                                                                <Label>Capaian</Label>
                                                                                <Input
                                                                                />
                                                                                <DialogFooter>
                                                                                    <DialogClose asChild>
                                                                                        <Button variant="outline">Batal</Button>
                                                                                    </DialogClose>
                                                                                    <Button type="submit">Simpan</Button>
                                                                                </DialogFooter>
                                                                            </DialogContent>
                                                                        </form>
                                                                    </Dialog>

                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button variant="secondary"><Info /></Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Info</DialogTitle>
                                                                            </DialogHeader>

                                                                            Dibuat : 16 September 2025 20.55
                                                                            <br />
                                                                            Diperbarui : 17 September 2025 09.27

                                                                            <DialogFooter>
                                                                                <DialogClose asChild>
                                                                                    <Button variant="outline">Batal</Button>
                                                                                </DialogClose>
                                                                                <Button>Hapus</Button>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>

                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button variant="secondary"><Trash /></Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                                                            </DialogHeader>
                                                                            <DialogDescription>
                                                                                Apakah Anda yakin ingin menghapus <strong>{k.indikator} tahun {item.tahun} </strong> ?
                                                                            </DialogDescription>
                                                                            <DialogFooter>
                                                                                <DialogClose asChild>
                                                                                    <Button variant="outline">Batal</Button>
                                                                                </DialogClose>
                                                                                <Button>Hapus</Button>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>

                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>Belum ada indikator.</p>
                                            )}
                                        </td>

                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout >
    );
}
