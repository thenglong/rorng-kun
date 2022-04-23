import { Role } from "@prisma/client"
import { cert, initializeApp } from "firebase-admin/app"
import { DecodedIdToken, getAuth } from "firebase-admin/auth"
import {
  CreateRequest,
  UpdateRequest,
} from "firebase-admin/lib/auth/auth-config"
import { UserRecord } from "firebase-admin/lib/auth/user-record"
import { getMessaging, MulticastMessage } from "firebase-admin/messaging"
import { getStorage } from "firebase-admin/storage"

import { UserClaims } from "../middlewares/auth.middleware"

const mockLogoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/d/d1/Y-FlyerLogo.png"

const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET_URL

const defaultApp = initializeApp({
  credential: cert(serviceAccount),
  storageBucket,
})

export const validateToken = (bearerToken: string): string => {
  const match = bearerToken.match(/^Bearer (.*)$/)
  if (!match || match.length < 2) {
    // createError(Unauthorized, "Invalid token")
  }
  return match[1]
}

export const getClaims = async (bearerToken: string): Promise<UserClaims> => {
  const token = validateToken(bearerToken)
  const auth = getAuth(defaultApp)

  try {
    const claims: DecodedIdToken = await auth.verifyIdToken(token)
    const { email, uid, roles } = claims
    return { email, uid, roles }
  } catch (err) {
    // createError(Unauthorized, err.message)
  }
}

export const createUser = async (
  createRequest: CreateRequest,
  roles: Role[]
): Promise<UserRecord> => {
  const auth = getAuth(defaultApp)
  const createdUser = await auth.createUser(createRequest)
  await auth.setCustomUserClaims(createdUser.uid, { roles })
  return createdUser
}

export const updateUser = async (
  uid: string,
  updateRequest: UpdateRequest,
  roles: Role[]
): Promise<UserRecord> => {
  const auth = getAuth(defaultApp)
  const updatedUser = await auth.updateUser(uid, updateRequest)
  await auth.setCustomUserClaims(uid, { roles })
  return updatedUser
}

export function deleteUser(uid: string): Promise<void> {
  const auth = getAuth(defaultApp)
  return auth.deleteUser(uid)
}

export async function uploadFile({
  fileBuffer,
  mimetype,
  bucketName,
}: {
  mimetype: string
  fileBuffer: Buffer
  bucketName: string
}) {
  const bucket = getStorage(defaultApp).bucket()
  const bucketFile = await bucket.file(bucketName)
  await bucketFile.save(fileBuffer, {
    contentType: mimetype,
    public: true,
  })
  return bucketFile.publicUrl()
}

export async function deleteFile(bucketName: string) {
  const bucket = getStorage(defaultApp).bucket()
  return bucket.file(bucketName).delete({ ignoreNotFound: true })
}

export async function sendMessage(
  payload: MulticastMessage["data"],
  tokens: string[]
) {
  const message: MulticastMessage = {
    data: payload,
    notification: {
      title: "New message",
      body: "New message from the server",
      imageUrl: mockLogoUrl, // TODO
    },
    webpush: {
      data: payload,
      notification: {
        title: "New message",
        vibrate: [200, 100, 200],
        body: "New message from the server",
        image: mockLogoUrl, // TODO
        data: payload,
        tag: mockLogoUrl, // TODO
        dir: "auto",
        lang: "en-US",
        renotify: true,
        requireInteraction: true,
        timestamp: Date.now(),
        badge: mockLogoUrl, // TODO
        actions: [], // TODO
        icon: mockLogoUrl, // TODO
        silent: false,
      },
    },
    tokens: tokens,
  }
  await getMessaging(defaultApp).sendMulticast(message)
}
