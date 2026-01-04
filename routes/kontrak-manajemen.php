<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KontrakManajemen\ResponsibilityController;
use App\Http\Controllers\KontrakManajemen\DetailController;

Route::middleware(['auth'])->group(function () {

    // page utama index
    Route::get('kontrak-manajemen', [ResponsibilityController::class, 'index'])
        ->name('kontrak-manajemen');

    Route::prefix('kontrak-manajemen')->name('kontrak-manajemen.')->group(function () {

        // page print
        Route::get('print', [ResponsibilityController::class, 'print'])
            ->name('print');

        // responsibility
        Route::post('responsibility', [ResponsibilityController::class, 'store'])->name('responsibility.store');
        Route::put('responsibility/{responsibility}', [ResponsibilityController::class, 'update'])->name('responsibility.update');
        Route::delete('responsibility/{responsibility}', [ResponsibilityController::class, 'destroy'])->name('responsibility.destroy');

        // detail
        Route::post('detail', [DetailController::class, 'store'])->name('detail.store');
        Route::put('detail/{detail}', [DetailController::class, 'update'])->name('detail.update');
        Route::delete('detail/{detail}', [DetailController::class, 'destroy'])->name('detail.destroy');
        Route::get('detail/{detail}/download', [DetailController::class, 'download'])->name('detail.download');
    });
});
