<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\RencanaStrategis\IndikatorController;
use App\Http\Controllers\RencanaStrategis\DetailController;

Route::middleware(['auth'])->group(function () {
    Route::get('rencana-strategis', [IndikatorController::class, 'index'])
        ->name('rencana-strategis');

    Route::post('indikator', [IndikatorController::class, 'store'])
        ->name('indikator.store');

    Route::put('indikator/{indikator}', [IndikatorController::class, 'update'])
        ->name('indikator.update');

    Route::delete('indikator/{indikator}', [IndikatorController::class, 'destroy'])
        ->name('indikator.destroy');

    Route::get('/rencana-strategis/print', [IndikatorController::class, 'print'])->name('rencana-strategis.print');

    // Rute untuk Detail
    Route::post('detail', [DetailController::class, 'store'])
        ->name('detail.store');

    Route::put('/detail/{id}', [DetailController::class, 'update'])->name('detail.update');

    Route::delete('detail/{detail}', [DetailController::class, 'destroy'])
        ->name('detail.destroy');

    Route::get('detail/{detail}/download', [DetailController::class, 'download'])
        ->name('detail.download');
});
