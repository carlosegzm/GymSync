# Endpoints 

Contrato da API, incluindo todos os endpoints de todos os controllers

## available-timeslot-controller

### POST /api/timeslots/generate  
#### request params:   
- trainerId * string($uuid) (query)
- startDate * string($date) (query)
- endDate *   string($date) (query)
- startTime * string        (query)
- endTime *   string        (query)
- durationMinutes * integer($int32) (query)  
    
#### response:   
```json
[
  {
    "id": 0,
    "date": "2026-06-22",
    "startTime": "string",
    "endTime": "string",
    "available": true,
    "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
]
```
  
### PATCH /api/timeslots/{slotId}/book/client/{clientId}  
#### request params:   
- slotId * integer($int64) (path)
- clientId * string($uuid) (path)
#### response:
```json
{
  "id": 0,
  "date": "2026-06-22",
  "startTime": "string",
  "endTime": "string",
  "available": true,
  "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
  
### GET /api/timeslots/trainer/{trainerId}  
#### request params:    
- trainerId *string($uuid) (path)
#### Response:
```json
[
  {
    "id": 0,
    "date": "2026-06-22",
    "startTime": "string",
    "endTime": "string",
    "available": true,
    "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
]
```
### DELETE /api/timeslots/{slotId}  
#### request: 
- slotId * integer($int64) (path)  
#### response: 
- 200 OK  

## client-subscription-controller

### POST /api/subscriptions/enroll
#### request: 
```json
{
  "clientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "planId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
#### response: 
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "clientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "planId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "startDate": "2026-06-22",
  "endDate": "2026-06-22",
  "status": "ACTIVE"
}
```

### PATCH /api/subscriptions/{subscriptionId}/cancel
#### request: 
- subscriptionId * string($uuid) (path)    
#### response:   
- 200 OK  

## membership-plan-controller
### POST /api/plans
#### req: 
```json
{
  "name": "string",
  "price": 0,
  "durationInMonths": 0,
  "gymId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
#### resp:
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "price": 0,
  "durationInMonths": 0,
  "gymId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
### GET /api/plans/gym/{gymId}
#### req: 
- gymId * string($uuid) (path)  
#### resp: 
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "price": 0,
    "durationInMonths": 0,
    "gymId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
]
```

## gym-controller
### POST /api/gyms
#### req: 
```json
{
  "name": "string",
  "cnpj": "string"
}
```
#### resp:
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "cnpj": "string"
}
```
## group-class-controller
### GET /api/group-classes
#### req: 
- no params  
#### resp: 
```json
[
  {
    "id": 0,
    "name": "string",
    "classType": "SPINNING",
    "startDateTime": "2026-06-22T12:34:35.830Z",
    "maxCapacity": 0,
    "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
]
```

### POST /api/group-classes
#### req:
```json
{
  "name": "string",
  "classType": "SPINNING",
  "startDateTime": "2026-06-22T12:38:41.609Z",
  "maxCapacity": 1,
  "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
#### resp:
```json
{
  "id": 0,
  "name": "string",
  "classType": "SPINNING",
  "startDateTime": "2026-06-22T12:38:41.610Z",
  "maxCapacity": 0,
  "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

------
## financial-transaction-controller 
### POST /api/finances
#### req
```json
{
  "description": "string",
  "amount": 0,
  "type": "INCOME",
  "category": "SALARY",
  "transactionDate": "2026-06-22",
  "gymId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
#### resp
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "description": "string",
  "amount": 0,
  "type": "INCOME",
  "category": "SALARY",
  "transactionDate": "2026-06-22",
  "gymId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
### GET /api/finances/gym/{gymId}/balance
#### req 
- gymId * string($uuid) (path)
#### resp
- 200 OK
- BIGDECIMAL: balance

## class-booking-controller
### POST /api/class-bookings
#### req
```json 
{
  "clientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "groupClassId": 0
}
```
#### resp
```json 
{
  "id": 0,
  "bookingDateTime": "2026-06-22T13:08:16.331Z",
  "clientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "groupClassId": 0
}
```

### PATCH /api/class-bookings/{bookingId}/status
#### req
- bookingId * integer($int64) (path)
- status * string (query)
#### resp
- 200 OK

### DELETE /api/class-bookings/{bookingId}/cancel/client/{clientId}
#### req
- bookingId * integer($int64) (path)
- clientId * string($uuid) (path)
#### resp
- 200 OK

## physical-assessment-controller
### POST /api/assessments
#### req
```json 
{
  "assessmentDate": "2026-06-22",
  "weight": 0.1,
  "height": 0.1,
  "bodyFatPercentage": 0.1,
  "clientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
#### resp
```json 
{
  "id": 0,
  "assessmentDate": "2026-06-22",
  "weight": 0.1,
  "height": 0.1,
  "bodyFatPercentage": 0.1,
  "clientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

### GET /api/assessments/client/{clientId}
#### req
- clientId * string($uuid) (path)
#### resp
```json 
[
  {
    "id": 0,
    "assessmentDate": "2026-06-22",
    "weight": 0.1,
    "height": 0.1,
    "bodyFatPercentage": 0.1,
    "clientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
]
```

## report-controller 

### GET /api/reports/finance/{gymId}

#### req
- gymId * string($uuid) (path)

#### resp
- byte[] (pdf)

### GET /api/reports/class-occupancy/{classId}

#### req
- classId * integer($int64) (path)

#### resp
- byte[] (pdf)

### GET /api/reports/assessment/{clientId}

#### req
- clientId * string($uuid) (path)

#### resp
- byte[] (pdf)

## dashboard-controler

### GET /api/dashboard/{gymId}/metrics

#### req
- gymId * string($uuid) (path)

#### resp
> Map<String, Object>
```json
{
  "gymId": "UUID",
  "activeMembers": "Long",
  "membersExpiringIn30Days": "Long",
  "netFinancialBalance": "BigDecimal"
}
```
