"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [watchlist, setWatchlist] = useState([])
  const [loadingWatchList, setLoadingWatchList] = useState(true)
  const [error, setError] = useState(null)

  const fetchWatchlist = async () => {
    if (!user?.id) {
      setWatchlist([])
      setLoadingWatchList(false)
      return
    }

    try {
      setLoadingWatchList(true)
      setError(null)

      const { data, error } = await supabase
        .from("watchlist")
        .select("media_id, media_type, poster_path, title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setWatchlist(data || [])
    } catch (err) {
      setError(err.message)
      console.error("Error fetching watchlist:", err.message)
    } finally {
      setLoadingWatchList(false)
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    fetchWatchlist()
  }, [user])

  useEffect(() => {
    if (!user?.id) return

    const subscription = supabase
      .channel("watchlist-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "watchlist",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchWatchlist(),
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [user])

  const addToWatchList = async (media_id, media_type, title, poster_path) => {
    if (!user?.id) {
      setError("User not authenticated")
      return false
    }

    try {
      setError(null)

      // Check if item already exists
      const existingItem = watchlist.find(
        (item) => String(item.media_id) === String(media_id) && item.media_type === media_type,
      )

      if (existingItem) {
        console.log("Item already in watchlist")
        return true
      }

      console.log("Adding to watchlist:", { user_id: user.id, media_id, media_type, title, poster_path })

      const { error } = await supabase.from("watchlist").insert([
        {
          user_id: user.id,
          media_id: String(media_id),
          media_type,
          title,
          poster_path,
        },
      ])

      if (error) throw error

      // Optimistically update the local state
      setWatchlist((prev) => [
        ...prev,
        {
          media_id: String(media_id),
          media_type,
          title,
          poster_path,
        },
      ])

      return true
    } catch (err) {
      setError(err.message)
      console.error("Error adding to watchlist:", err)
      return false
    }
  }

  const removeFromWatchList = async (media_id, media_type) => {
    if (!user?.id) {
      setError("User not authenticated")
      return false
    }

    try {
      setError(null)

      console.log("Removing from watchlist:", { media_id, media_type, user_id: user.id })

      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("media_id", String(media_id))
        .eq("media_type", media_type)

      if (error) throw error

      // Optimistically update the local state
      setWatchlist((prev) =>
        prev.filter((item) => !(String(item.media_id) === String(media_id) && item.media_type === media_type)),
      )

      return true
    } catch (err) {
      setError(err.message)
      console.error("Error removing from watchlist:", err)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        addToWatchList,
        removeFromWatchList,
        watchlist,
        loadingWatchList,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
