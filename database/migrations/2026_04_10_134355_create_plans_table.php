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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('num_weeks')->default(4);
            $table->boolean('is_active')->default(false);
            $table->boolean('is_paid')->default(false)->after('is_active');
            $table->string('stripe_payment_intent')->nullable()->after('is_paid');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('pt_id')->nullable()->constraind('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
