<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('renstra_indikator', function (Blueprint $table) {
            $table->id();
            $table->string('main_program');
            $table->string('indikator');
            $table->string('bidang');
            $table->string('tipe_data');
            $table->timestamps();
        });

        Schema::create('renstra_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('renstra_indikator_id')
                ->constrained('renstra_indikator')
                ->onDelete('cascade');
            $table->string('tahun');
            $table->string('target');
            $table->string('capaian')->nullable();
            $table->string('status')->nullable();
            $table->string('nama_dokumen')->nullable();
            $table->string('url_dokumen')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('renstra_indikator');
        Schema::dropIfExists('renstra_detail');
    }
};
