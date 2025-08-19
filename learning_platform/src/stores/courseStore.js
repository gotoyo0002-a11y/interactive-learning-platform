import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useCourseStore = create((set, get) => ({
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  
  // 獲取所有課程
  fetchCourses: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ courses: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 獲取單個課程詳情
  fetchCourse: async (courseId) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()
      
      if (error) throw error
      set({ currentCourse: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 創建課程
  createCourse: async (courseData) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single()
      
      if (error) throw error
      
      // 更新課程列表
      const { courses } = get()
      set({ 
        courses: [data, ...courses],
        loading: false 
      })
      
      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },
  
  // 更新課程
  updateCourse: async (courseId, updates) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId)
        .select()
        .single()
      
      if (error) throw error
      
      // 更新課程列表
      const { courses } = get()
      const updatedCourses = courses.map(course => 
        course.id === courseId ? data : course
      )
      set({ 
        courses: updatedCourses,
        currentCourse: data,
        loading: false 
      })
      
      return { success: true, data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },
  
  // 刪除課程
  deleteCourse: async (courseId) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
      
      if (error) throw error
      
      // 從課程列表中移除
      const { courses } = get()
      const filteredCourses = courses.filter(course => course.id !== courseId)
      set({ 
        courses: filteredCourses,
        loading: false 
      })
      
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },
  
  // 選課
  enrollCourse: async (courseId, userId) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: userId,
          status: 'active',
          progress_percentage: 0
        })
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  
  // 獲取用戶已選課程
  fetchUserCourses: async (userId) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('student_id', userId)
        .order('enrolled_at', { ascending: false })
      
      if (error) throw error
      set({ courses: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))

