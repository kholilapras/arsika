<?php

namespace App\Http\Controllers\KontrakManajemen;

use App\Http\Controllers\Controller;
use App\Models\KontrakManajemen\Detail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DetailController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'km_responsibility_id' => ['required', 'exists:km_responsibility,id'],
            'tw_km' => ['required', 'string', 'max:20'],
            'bobot_km' => ['required', 'string', 'max:50'],
            'target_km' => ['required', 'string', 'max:255'],
        ]);

        // kolom realisasi_km tidak nullable (sesuai migration), isi default
        $validated['realisasi_km'] = '';

        Detail::create($validated);

        return back()->with('success', 'Detail berhasil ditambahkan.');
    }

    public function update(Request $request, Detail $detail)
    {
        // Dipakai untuk:
        // 1) Edit detail (tw, bobot, target)
        // 2) Isi realisasi + upload dokumen PDF (max 20MB)
        $validated = $request->validate(
            [
                'tw_km' => ['sometimes', 'required', 'string', 'max:20'],
                'bobot_km' => ['sometimes', 'required', 'string', 'max:50'],
                'target_km' => ['sometimes', 'required', 'string', 'max:255'],
                'realisasi_km' => ['sometimes', 'required', 'string', 'max:255'],

                // ✅ PDF only, max 20MB (20480 KB)
                'dokumen' => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            ],
            [
                'dokumen.mimes' => 'Dokumen harus berformat PDF.',
                'dokumen.max' => 'Ukuran dokumen maksimal 20MB.',
            ]
        );

        // update field text kalau ada
        foreach (['tw_km', 'bobot_km', 'target_km', 'realisasi_km'] as $field) {
            if (array_key_exists($field, $validated)) {
                $detail->{$field} = $validated[$field];
            }
        }

        // upload dokumen PDF
        if ($request->hasFile('dokumen')) {
            $disk = Storage::disk('public');

            // hapus file lama jika ada
            if ($detail->url_dokumen_km && $disk->exists($detail->url_dokumen_km)) {
                $disk->delete($detail->url_dokumen_km);
            }

            $file = $request->file('dokumen');

            // simpan ke storage/app/public/kontrak-manajemen/km-detail
            $path = $file->store('kontrak-manajemen/km-detail', 'public');

            $detail->nama_dokumen_km = $file->getClientOriginalName();
            $detail->url_dokumen_km = $path;
        }

        $detail->save();

        return back()->with('success', 'Detail berhasil diperbarui.');
    }

    public function destroy(Detail $detail)
    {
        $disk = Storage::disk('public');

        if ($detail->url_dokumen_km && $disk->exists($detail->url_dokumen_km)) {
            $disk->delete($detail->url_dokumen_km);
        }

        $detail->delete();

        return back()->with('success', 'Detail berhasil dihapus.');
    }

    public function download(Detail $detail)
    {
        if (!$detail->url_dokumen_km) {
            abort(404);
        }

        $disk = Storage::disk('public');

        if (!$disk->exists($detail->url_dokumen_km)) {
            abort(404);
        }

        $filename = $detail->nama_dokumen_km ?: basename($detail->url_dokumen_km);

        $fullPath = $disk->path($detail->url_dokumen_km);

        return response()->download($fullPath, $filename);
    }
}
