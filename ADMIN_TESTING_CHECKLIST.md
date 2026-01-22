# Comprehensive Admin System Testing Checklist

This document provides a comprehensive checklist for testing the Red Lotus admin dashboard.

## I. Authentication

-   [ ] **Access Control:** Visiting `/admin` without being logged in should redirect to `/login`.
-   [ ] **Valid Login:** A user with correct admin credentials can successfully log in and is redirected to `/admin`.
-   [ ] **Invalid Login:** A user with incorrect credentials sees a "Failed to sign in" error message and remains on the login page.
-   [ ] **Logout:** Clicking the "Sign Out" button in the admin dashboard logs the user out and terminates their session.

## II. Content Hub (`EnhancedContentManager`)

This section uses **LocalStorage**, so tests should verify the `redlotus_posts` key in your browser's LocalStorage.

### Creating Content
-   [ ] **Create Text Post:** Create a new "Announcement" or "Quote" post. Verify it is added correctly to LocalStorage and appears in the post list.
-   [ ] **Create Image Post:** Create a new "Image Post".
    -   [ ] Verify a file is uploaded to the `content-posts/image/` folder in Firebase Storage.
    -   [ ] Verify the post is added to LocalStorage with the `content` field containing the image's Firebase Storage URL.
-   [ ] **Create Video/Music Post:** Create a "Video" or "Music" post.
    -   [ ] Verify a file is uploaded to the correct folder in Firebase Storage.
    -   [ ] Verify the post is added to LocalStorage with the URL.

### Reading and Filtering Content
-   [ ] **View All Posts:** Verify all posts from LocalStorage are displayed when filters are set to "all".
-   [ ] **Filter by Section:** Select a specific section from the "Filter by Section" dropdown. Verify that only posts matching that section are displayed.
-   [ ] **Filter by Tribe:** Select a specific tribe from the "Filter by Tribe" dropdown. Verify that only posts matching that tribe (or "All Tribes") are displayed.

### Updating and Managing Content
-   [ ] **Edit Post:** Click "Edit" on a post. Change its title and content, then save. Verify the changes are reflected in LocalStorage and in the UI.
-   [ ] **Toggle Visibility (Show/Hide):** Click "Hide" on an active post. Verify its `isActive` flag is set to `false` in LocalStorage and the UI updates. Click "Show" on a hidden post and verify the opposite.
-   [ ] **Toggle Pin:** Click the pin icon on a post. Verify its `isPinned` flag is toggled in LocalStorage and the UI updates.
-   [ ] **Delete Post:** Click "Delete" on a post. Verify it is removed from LocalStorage and the UI.

## III. Store Manager (`StoreManager`)

This section uses the **`store` collection in Firestore**.

### Creating Store Items
-   [ ] **Create Merch Item:** Create a new "Merchandise" item with an image.
    -   [ ] Verify a new document is created in the `store` collection in Firestore.
    -   [ ] Verify the image is uploaded to the `store/images/` folder in Firebase Storage and the URL is saved in the document.
-   [ ] **Create Music Item:** Create a new "Music" item with an image and an audio file.
    -   [ ] Verify a new document is created in the `store` collection.
    -   [ ] Verify the image and audio file are uploaded to the correct folders in Firebase Storage and their URLs are saved.

### Managing Store Items
-   [ ] **Edit Item:** Edit an existing item's price and description. Verify the document in Firestore is updated.
-   [ ] **Toggle Featured:** Click "Feature" on an item. Verify the `featured` field in its Firestore document is set to `true`. Click "Unfeature" and verify it's set to `false`.
-   [ ] **Delete Item:** Delete an item. Verify its document is removed from the `store` collection in Firestore.

## IV. Media Upload (Legacy)

This section primarily adds items to the **`store` collection in Firestore**.

-   [ ] **Upload Image:** Use the "Upload Images" form.
    -   [ ] Verify the image is uploaded to the `images` folder in Firebase Storage.
    -   *Note: This uploader might not create a Firestore document. Verify behavior.*
-   [ ] **Upload Music:** Use the "Upload Music" form.
    -   [ ] Verify the audio file is uploaded to the `music` folder in Firebase Storage.
    -   [ ] Verify a new document is created in the `store` collection with the URL and metadata.
    -   [ ] Verify the "Uploaded Songs" list in the UI updates.

## V. Fan Art Management

-   [ ] **Setup:** Manually add a document to the `fanart` collection in Firestore with `approved: false` to simulate a fan submission.
-   [ ] **View Pending Art:** Navigate to the "Fan Art" tab and verify the pending submission is displayed.
-   [ ] **Approve Art:** Click "Approve".
    -   [ ] Verify the `approved` field for the document in Firestore is set to `true`.
    -   [ ] Verify the item disappears from the pending list.
-   [ ] **Reject Art:** On a second test submission, click "Reject".
    -   [ ] Verify the document is deleted from the `fanart` collection in Firestore.
    -   [ ] Verify the item disappears from the pending list.

## VI. Booking Manager

This section uses the **`bookings` collection in Firestore**.

-   [ ] **Setup:** Manually add a new booking document to the `bookings` collection with `status: 'pending'`.
-   [ ] **View Bookings:** Verify the new booking request appears in the list.
-   [ ] **Update Status:** Select a booking.
    -   [ ] Change its status to "Approved". Verify the `status` field is updated in Firestore.
    -   [ ] Change its status to "Negotiating". Verify the `status` is updated.
-   [ ] **Add Notes:** Add a note to a booking and update its status. Verify the `adminNotes` field is saved in Firestore.
-   [ ] **Delete Booking:** Delete a booking. Verify the document is removed from the `bookings` collection.

## VII. Other Managers

-   [ ] **Community Posts:**
    -   [ ] Test the approve/reject functionality for community posts, noting that it uses LocalStorage.
-   [ ] **Analytics:**
    -   [ ] Verify the tribe member counts are displayed, noting this also uses LocalStorage.
-   [ ] **Legacy Content Manager:**
    -   [ ] Perform basic Create, Read, Update, and Delete tests on the "Legacy Content" tab, noting that it uses the `content` collection in Firestore.
-   [ ] **Messages & Vibe Quotes:**
    -   [ ] Explore the functionality of these tabs and verify they work as expected. (I have not investigated the code for these managers).