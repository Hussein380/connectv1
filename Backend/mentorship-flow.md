# Mentorship Connection Flow

## 1. Opportunity Viewing

### Current Issues:
- Opportunities don't show clickable links
- No direct way to contact mentors
- Complex mentorship request process

### Improved Opportunity Card Design
```javascript
// Opportunity component structure
const OpportunityCard = {
  header: {
    title: String,
    mentorName: String,
    postedDate: Date
  },
  body: {
    description: String,
    applicationLink: {
      url: String,
      isClickable: true
    },
    deadline: Date
  },
  actions: {
    requestMentorship: Button,
    viewMentorProfile: Button
  }
};
```

## 2. Mentor Profile Enhancement

### Add Contact Information to User Model
```javascript
// Update User Schema
const userSchema = {
  // ... existing fields
  contactInfo: {
    whatsapp: {
      number: String,
      isVisible: Boolean,  // Control privacy
    },
    email: {
      address: String,
      isVisible: Boolean,
    },
    preferredContact: {
      type: String,
      enum: ['whatsapp', 'email'],
      default: 'email'
    }
  }
};
```

## 3. Simplified Mentorship Request Flow

### Step 1: View Opportunity & Mentor
- Mentee sees opportunity
- Can view mentor's public profile
- Basic mentor info visible to all

### Step 2: Send Request
```javascript
// Mentorship Request Structure
const mentorshipRequest = {
  menteeId: String,
  mentorId: String,
  opportunityId: String,
  message: String,
  status: 'pending',
  createdAt: Date
};
```

### Step 3: Mentor Approval
- Mentor receives notification
- Reviews mentee profile
- Accepts/Rejects request

### Step 4: Connection
- Upon approval:
  - Mentee gets mentor's contact info
  - WhatsApp/Email button becomes active
  - Direct communication enabled

## 4. UI Components Needed

### Opportunity Page
```jsx
<OpportunityCard>
  <Title>{opportunity.title}</Title>
  <Description>{opportunity.description}</Description>
  <ApplicationLink href={opportunity.link} target="_blank">
    Apply Here
  </ApplicationLink>
  
  <MentorPreview>
    <Avatar src={mentor.avatar} />
    <Name>{mentor.name}</Name>
    <Expertise>{mentor.expertise}</Expertise>
    <RequestMentorshipButton 
      onClick={handleMentorshipRequest}
      disabled={alreadyRequested}
    />
  </MentorPreview>
</OpportunityCard>
```

### Mentor Profile Modal
```jsx
<MentorProfile>
  <ProfileHeader>
    <Avatar />
    <Name />
    <Bio />
  </ProfileHeader>

  <ContactSection>
    {isApprovedMentee ? (
      <>
        <WhatsAppButton 
          href={`https://wa.me/${mentor.whatsapp}`}
          visible={mentor.contactInfo.whatsapp.isVisible}
        />
        <EmailButton 
          href={`mailto:${mentor.email}`}
          visible={mentor.contactInfo.email.isVisible}
        />
      </>
    ) : (
      <RequestMentorshipButton />
    )}
  </ContactSection>

  <OpportunitiesSection>
    {/* List of mentor's opportunities */}
  </OpportunitiesSection>
</MentorProfile>
```

## 5. API Endpoints Needed

```javascript
// New/Updated Endpoints
const endpoints = {
  // Get mentor profile with contact info (if approved)
  'GET /api/mentors/:id': {
    response: {
      mentorProfile: Object,
      contactInfo: Object, // Only if approved mentee
      opportunities: Array
    }
  },

  // Send mentorship request
  'POST /api/mentorship/request': {
    body: {
      mentorId: String,
      opportunityId: String,
      message: String
    }
  },

  // Accept/Reject mentorship request
  'PUT /api/mentorship/request/:id': {
    body: {
      status: 'accepted' | 'rejected',
      message?: String
    }
  }
};
```

## 6. Implementation Steps

1. **Update Database Schema**
   - Add contact fields to User model
   - Add visibility controls
   - Update mentorship request model

2. **Backend Changes**
   - Add contact info to mentor profile API
   - Update mentorship request handling
   - Add validation for contact info

3. **Frontend Updates**
   - Create new opportunity card design
   - Add mentor profile modal
   - Implement WhatsApp/Email buttons
   - Add request flow UI

4. **Testing**
   - Test contact visibility rules
   - Verify mentorship request flow
   - Check contact button functionality

## 7. User Flow

1. **Mentee:**
   - Browses opportunities
   - Clicks on interesting opportunity
   - Views mentor profile
   - Sends mentorship request
   - Waits for approval
   - Upon approval, gets contact access

2. **Mentor:**
   - Receives request notification
   - Reviews mentee profile
   - Accepts/Rejects request
   - If accepted, contact info shared

This design simplifies the connection process while maintaining privacy and control for mentors. The WhatsApp/Email buttons only become available after mentorship approval, ensuring appropriate access control. 