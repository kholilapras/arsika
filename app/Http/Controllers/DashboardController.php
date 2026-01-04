<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\RencanaStrategis\Indikator;
use App\Models\KontrakManajemen\Responsibility;

class DashboardController extends Controller
{
    public function __invoke()
    {
        /**
         * =========================
         * A) RENSTRA: ambil dari tabel details (karena tahun ada di detail)
         * - indikator: COUNT DISTINCT fk indikator di tabel detail
         * - detail: COUNT(*) di tabel detail
         * =========================
         */
        $indikatorModel = new Indikator();
        $detailsRel = $indikatorModel->details();

        // Ambil info tabel detail + foreign key dari relasi (tanpa hardcode)
        $detailTable = $detailsRel->getModel()->getTable();          // misal: renstra_indikator_details
        $fkIndikator = $detailsRel->getForeignKeyName();             // misal: indikator_id / renstra_indikator_id

        $renstraByYear = DB::table($detailTable)
            ->selectRaw('CAST(tahun AS CHAR) as tahun, COUNT(*) as detail, COUNT(DISTINCT ' . $fkIndikator . ') as indikator')
            ->whereNotNull('tahun')
            ->groupBy('tahun')
            ->orderByDesc('tahun')
            ->get()
            ->keyBy('tahun'); // key = "2024", "2025", dst

        /**
         * =========================
         * B) KONTRAK MANAJEMEN: tahun ada di responsibility (tahun_km)
         * - responsibility: count per tahun_km
         * - detail: sum(details_count) per tahun_km
         * =========================
         */
        $kmByYear = Responsibility::query()
            ->select('tahun_km')
            ->withCount('details')
            ->get()
            ->groupBy(fn ($r) => (string) $r->tahun_km)
            ->map(function ($rows, $tahun) {
                return [
                    'tahun' => (string) $tahun,
                    'responsibility' => (int) $rows->count(),
                    'detail' => (int) $rows->sum('details_count'),
                ];
            })
            ->keyBy('tahun');

        /**
         * =========================
         * C) Gabungkan semua tahun yang tersedia dari dua modul
         * =========================
         */
        $years = collect($renstraByYear->keys())
            ->merge($kmByYear->keys())
            ->unique()
            ->sortDesc()
            ->values();

        $statsByYear = $years->map(function ($tahun) use ($renstraByYear, $kmByYear) {
            $rs = $renstraByYear->get($tahun);
            $km = $kmByYear->get($tahun);

            return [
                'tahun' => (string) $tahun,
                'rencanaStrategis' => [
                    'indikator' => (int) ($rs->indikator ?? 0),
                    'detail'    => (int) ($rs->detail ?? 0),
                ],
                'kontrakManajemen' => [
                    'responsibility' => (int) ($km['responsibility'] ?? 0),
                    'detail'         => (int) ($km['detail'] ?? 0),
                ],
            ];
        })->values();

        return Inertia::render('dashboard', [
            'statsByYear' => $statsByYear,
        ]);
    }
}
