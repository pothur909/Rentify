# Fix for Duplicate Package History Entries on Subscriptions

## Problem
When a broker purchased a monthly subscription, two packageHistory entries were being created:
1. A `one_time` entry (incorrect)
2. A `monthly_subscription` entry (correct)

Both entries had the same start date, package, and lead count, indicating they were created simultaneously.

## Root Cause
The subscription webhook handler (`subscription.activated` or `subscription.charged`) was calling `assignLeadPackageToBroker()`, which:
1. Created a `one_time` packageHistory entry (because `autoRenew` wasn't passed in the request)
2. Then called `updatePackageHistoryWithPayment()` which created/updated another entry to `monthly_subscription`

This resulted in duplicate entries for every monthly subscription purchase.

## Solution

### Code Changes

#### 1. Modified Subscription Webhook Handler
**File:** `backend/controllers/razorPayment.controller.js`

Changed the `handleSubscriptionEvent()` function to:
- **Stop calling** `assignLeadPackageToBroker()` 
- **Directly assign** the package to the broker
- **Create only ONE** packageHistory entry with `subscriptionType: 'monthly_subscription'`
- Include automatic lead assignment logic inline

This ensures that subscriptions only create a single, correctly-typed packageHistory entry.

### Data Cleanup

#### 2. Cleanup Script
**File:** `backend/scripts/cleanupDuplicatePackageHistory.js`

Created a cleanup script that:
- Finds all brokers with packageHistory
- Identifies subscription entries (those with `subscriptionId` and `monthly_subscription` type)
- Removes matching `one_time` entries that:
  - Have the same package
  - Were created within 2 seconds of the subscription entry
  - Are clearly duplicates of the subscription entry

**Results:**
- 1 broker affected
- 1 duplicate entry removed

### Testing

#### 3. Test Script
**File:** `backend/scripts/testSubscriptionPackageHistory.js`

Created a verification script that:
- Displays all packageHistory entries for a broker
- Counts subscription types
- Detects duplicate subscription entries
- Validates data integrity

## Before and After

### Before Fix
```
Broker: hg (+917897876567)
PackageHistory entries: 2

Entry 1:
  Type: testing
  Subscription Type: one_time ❌
  Status: active
  Leads: 0/5

Entry 2:
  Type: testing
  Subscription Type: monthly_subscription ✓
  Status: active
  Leads: 0/5
  Subscription ID: 6942608c25029f382a7fdc8f
```

### After Fix
```
Broker: hg (+917897876567)
PackageHistory entries: 1

Entry 1:
  Type: testing
  Subscription Type: monthly_subscription ✓
  Status: active
  Leads: 0/5
  Subscription ID: 6942608c25029f382a7fdc8f
```

## Future Prevention

With the code changes in place, future monthly subscription purchases will:
1. Only create a single `monthly_subscription` packageHistory entry
2. Properly link the entry to the `PaymentSubscription` via `subscriptionId`
3. Not create any duplicate `one_time` entries

## How to Run Cleanup (if needed)

If you encounter this issue again with different brokers:

```bash
cd backend
node scripts/cleanupDuplicatePackageHistory.js
```

To verify the fix:
```bash
node scripts/testSubscriptionPackageHistory.js
```

To list all brokers:
```bash
node scripts/listBrokers.js
```
