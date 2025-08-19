import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  
  // 初始化認證狀態
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await get().setUser(session.user)
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      set({ loading: false })
    }
  },
  
  // 設置用戶
  setUser: async (user) => {
    set({ user })
    if (user) {
      await get().fetchProfile(user.id)
    } else {
      set({ profile: null })
    }
  },
  
  // 獲取用戶檔案
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      set({ profile: data })
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  },
  
  // 登錄
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  
  // 註冊
  signUp: async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  
  // 登出
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, profile: null })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}))

// 監聽認證狀態變化
supabase.auth.onAuthStateChange((event, session) => {
  const { setUser } = useAuthStore.getState()
  setUser(session?.user || null)
})

