<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('dummy-rencana-strategis', function () {
        return Inertia::render('dummy/dummy-rencana-strategis');
    })->name('dummy-rencana-strategis');
});

require __DIR__ . '/rencana-strategis.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
