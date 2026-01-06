<?php

namespace App\Http\Controllers\RencanaStrategis;

use App\Http\Controllers\Controller;
use App\Models\RencanaStrategis\Detail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DetailController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'renstra_indikator_id' => 'required|integer',
            'tahun'                => 'required|integer',
            'target'               => 'required|string|max:255',
        ]);

        Detail::create($validated);

        return redirect()->route('rencana-strategis')->with('success', 'Data berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        Log::info("📥 Request diterima untuk update detail {$id}", $request->all());

        $validated = $request->validate([
            'capaian' => 'nullable|string',
            'dokumen' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        Log::info("Data tervalidasi:", $validated);

        $detail = Detail::findOrFail($id);

        $rawCapaian = $validated['capaian'] ?? null;
        $status = "0%";

        if ($rawCapaian) {
            $capaianNum = $this->parseNumber($rawCapaian);
            $targetNum  = $this->parseNumber($detail->target);

            if ($targetNum > 0) {
                $status = round(($capaianNum / $targetNum) * 100, 2) . '%';
            } else {
                $status = $capaianNum . '%';
            }
        }

        $validated['capaian'] = $rawCapaian;
        $validated['status']  = $status;

        if ($request->hasFile('dokumen')) {
            $file = $request->file('dokumen');
            $path = $file->store('dokumen_renstra', 'public');
            $validated['nama_dokumen'] = $file->getClientOriginalName();
            $validated['url_dokumen']  = $path;

            Log::info("Dokumen diupload:", [
                'nama' => $validated['nama_dokumen'],
                'path' => $validated['url_dokumen'],
            ]);
        }

        $detail->update($validated);

        Log::info("Detail {$id} berhasil diperbarui");

        return back()->with('success', 'Detail berhasil diperbarui');
    }

    public function destroy(Detail $detail)
    {
        if ($detail->url_dokumen && Storage::disk('public')->exists($detail->url_dokumen)) {
            Storage::disk('public')->delete($detail->url_dokumen);
            Log::info("Dokumen dihapus saat destroy: {$detail->url_dokumen}");
        }

        $detail->delete();

        return redirect()->route('rencana-strategis')->with('success', 'Data berhasil dihapus');
    }

    private function parseNumber($value): float
    {
        $value = trim((string) $value);

        // Format rasio "a:b"
        if (str_contains($value, ':')) {
            [$a, $b] = explode(':', $value);
            $a = floatval(str_replace(',', '.', str_replace('.', '', $a)));
            $b = floatval(str_replace(',', '.', str_replace('.', '', $b)));
            return $b > 0 ? $a / $b : 0;
        }

        // Format persen "xx%" atau "xx,xx%"
        if (str_contains($value, '%')) {
            return floatval(str_replace(',', '.', str_replace('%', '', $value)));
        }

        // Angka biasa (hilangkan pemisah ribuan)
        return floatval(str_replace(',', '.', str_replace('.', '', $value)));
    }

    public function download($id)
    {
        $detail = Detail::findOrFail($id);

        if (!$detail->url_dokumen || !Storage::disk('public')->exists($detail->url_dokumen)) {
            return back()->with('error', 'Dokumen tidak ditemukan');
        }

        // get absolute path disk public
        $absolutePath = Storage::disk('public')->path($detail->url_dokumen);

        return response()->download($absolutePath, $detail->nama_dokumen);
    }
}
