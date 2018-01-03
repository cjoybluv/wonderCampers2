Trips:
  organizer: User
  invitees: User || email
  guardians: User || email
  helpers: User || email
  locations: RecArea || Facility || {placename, address || geoLoc}
  activities: Activity {name, code}
  documents: file
  forms: node

============================================================================================================
Invitations:
    Organizer          Where              When               Status

Trips:
    Organizer         Where              When               Status



Home
Discover
Plan
  Trips
  Locations
  Activities
  Forms
  Documents


Forms
  Name: string
  Description: string
  elements: [node]
    node: [CheckList, TextBlock, InitialPlease, SignatureRequired,SignatureDate]
      CheckList: name, instructions, items[item={itemText, itemAttributes[required]}]

Locations
  placeName: string
  activities: [{code,name}]
  geoLoc: {lat,lng}
  directions: longText
  description: longText
  documents
  links
  ridb{type[reaArea,facility],id,link}
  address

Activities:  
  code
  name
  description
  forms
  documents

Documents:
   >> spike: blob storage
   filename
   description
   fileType
   size
   blobAddress?

Trips:
  organizer: User
  invitees: User || email
  helpers: User || email
  locations
  forms
  documents
  dates & times
  description
  selfDescribed.longText[Directions,specialNeeds,...]
