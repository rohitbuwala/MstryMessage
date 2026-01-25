import React from 'react'

import {
  Card,
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Anonymous Message</CardTitle>
          <CardDescription>{new Date(message.createdAt).toLocaleString()}</CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <X className='w-4 h-4'/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{message.content}</p>
      </CardContent>
    </Card>
  )
}

export default MessageCard