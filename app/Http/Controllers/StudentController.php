<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index() { return Student::all(); }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:students',
            'course' => 'required'
        ]);
        return Student::create($request->all());
    }

    public function show($id) { return Student::findOrFail($id); }

    public function update(Request $request, $id) {
        $student = Student::findOrFail($id);
        $student->update($request->all());
        return $student;
    }

    public function destroy($id) {
        Student::destroy($id);
        return response()->noContent();
    }
}
