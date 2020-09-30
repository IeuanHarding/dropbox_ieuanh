# dropbox_ieuanh

Version 1 of my dropbox. 

How it works:
- Standard dropbox features - choose file using 'Choose Files', upload using 'upload'.
- Click 'refresh' to see which files are in the uploads folder
- Use the dropdown menu to select which file should be downloaded, and click download to download the file.


To Improve:
- CSS 
- Clean up the javascript files, they're a mess of notes/scattered code.
- Populate the menu and files present list on upload, instead of having to use a refresh button - this can be used by having a GET request constantly firing from the frontend to populate those areas, with a handler firing from the backend whenever the POST request completes.
- This would also allow for more than the name to be displayed - the file size, date uploaded etc. can also be displayed on the list


