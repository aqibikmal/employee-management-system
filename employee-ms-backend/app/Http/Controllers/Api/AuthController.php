<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
    public function login(LoginRequest $request)
    {
        // Validasi kini berlaku secara automatik sebelum kod ini berjalan.
        // Jika gagal, ia akan pulangkan ralat 422 secara automatik.

        // Cuba untuk log masuk pengguna
        if (! Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The credentials provided are incorrect.'],
            ]);
        }

        // Dapatkan user yang telah disahkan
        $user = User::where('email', $request->email)->firstOrFail();

        // Cipta token dan pulangkan response
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Get the authenticated User.
     */
    public function user(Request $request) // <-- TAMBAH METHOD INI
    {
        // Pulangkan maklumat pengguna yang sedang log masuk
        return response()->json($request->user());
    }
}
