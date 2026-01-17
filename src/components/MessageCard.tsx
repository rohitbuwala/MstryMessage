import React from 'react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { toast } from 'sonner'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProps ={
    message: Message;
    OnMessageDelete: (messageId: string) => void
}

const MessageCard = ({message, OnMessageDelete}: MessageCardProps) => {
    const handlDeleteConfirm = async() => {
         const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
         toast(response.data.message);
        // let id = message._id
      OnMessageDelete(message._id
        .toString())   //extra line add types error
    }

  return (
    <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
     <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
    </CardHeader>
    <CardFooter>
    </CardFooter>
</Card>
  )
}

export default MessageCard