<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plan_exercises', function (Blueprint $table) {
            // Aggiungiamo la colonna dopo 'day_of_week'
            // La mettiamo integer. Se hai già dati, conviene dare un default(1)
            $table->integer('week_number')->default(1)->after('day_of_week');
        });
    }

    public function down(): void
    {
        Schema::table('plan_exercises', function (Blueprint $table) {
            // Serve per poter annullare la migrazione in caso di errore
            $table->dropColumn('week_number');
        });
    }
};