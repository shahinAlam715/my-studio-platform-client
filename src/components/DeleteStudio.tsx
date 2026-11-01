"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"


export default function DeleteStudio({id}: {id: string}) {
  

    const handleDelete = async()=>{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studiodata/${id}`, {
            method: "DELETE"
        })
        const data = await res.json()
        
        if (data) {
            redirect("/studios-explore")
        }
        }


  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant={"destructive"}>Delete</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
