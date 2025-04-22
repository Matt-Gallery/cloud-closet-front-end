# Closet Cloud

## Project Description

### Our application is called Closet Cloud. It provides recommendations to users on what outfit to wear based on their saved wardrobe items and the weather forecast.

## Application Description

The purpose of the application is to make it easy for users to decide what to wear each day based on the weather forecast.  It will allow users to build a database of items they have in their wardrobe and some parameters for what weather they prefer to wear each item in and then based on the weather forecast it will propse outfit options for the day.

## User Stories

### MVP Goals
- **Create Account**
    - As a user, I want to be able to create an account, so that I can save all my wardrobe items and preferences.
- **Log In**
    -As a user, I want to be able to log in to my account, so that I can save my wardrobe items and preferences and get outfit recommendations.
- **View Account Details**
    - As a user, I want to be able to view my account details, so that I can know that my account information is accurate.
    - This page can be the same as the create account page, but the fields will be populated with the users saved information and they can edit and resave each field.
- **Edit Account Details**
    - As a user, I want to be able to edit my account details, so that I can update any details if they change or fix any errors.
- **Delete Account**
    - As a user, I want to be able to delete my account, so that I can protect my data and reduce spam communications if I choose to no longer use this application.
    - This feature will be included on the edit account page, it just adds a delete button.
- **Create New Wardrobe Items**
    - As a user, I want to be able to add items to my wardrobe and assign each item a rating so that those items are included in my outfit recommendations.
    - Each wardrobe item should include basic parameters for the weather conditions in which that item should be worn.
- **Update/Delete Wardrobe Items**
    - As a user, I want to be able to update or delete any of the items saved in my wardrobe so that the items in my wardrobe are accurate.
- **View Outfit Recommendations**
    - As a user, I want to receive recommendations for outfits to wear based on the items saved in my wardrobe and the weather forecast.
- **Cycle Wardrobe Item Recommendations**
    - As a user, I want to to be able to tell the app that I don't want to wear a particular wardrobe item today and have it cycle that item to another recommendation so I can get to an outfit combination that I like.
- **Cycle Outfit Recommendation**
    - As a user, I want to to be able to:
      * Tell the app that I don't want to wear a recommended outfit today and have it cycle the entire outfit to another recommendation
      * Tell the app that I don't want to wear a recommended outfit ever and have it cycle that entire outfit to another recommendation and save this preference and have it applied to future recommendations
- **View Rated Outfits**
    - As a user, I want to to be able to view all of the outfits I've rated.
- **Edit Rated Outfits**
    - As a user, I want to to be able to edit each of the outfits I've rated.

### Stretch Goals
- **More Specific Response Options for Recommendations**
    - As a user, when I'm cycling through different outfit options I want to be able to specify whether I'm rejecting a particular wardroom item for today's outfit or I don't like that item in combination with the rest of a recommended outfit so I never want to see that combination again so that I can better refine my future recommendations.
- **Adjust Mix of Recommendations Between Rated and Unrated Outfits**
    - As a user, I want to be able to adjust the mix of outfit recommendations I receive between ones that I've rated and new ones that I haven't rated.
- **Connect Wardrobe Item Creation Function to Web/Internal DB Search for Item**
    - As a user, as I'm creating/editing a wardrobe item I want to be given example items to choose from pulled from the web so that I can select the actual item and have it easily populated with correct information and photo.
- **Wish/Shopping List**
    - As a user, I want to be able to create a wish/shopping list so that I can keep track of items I want to add to my wardrobe and can more easily shop for them.
- **Trip Packing List**
    - As a user, I want to be able to create multi-day sets of outfits so that I can plan my wardrobe over longer periods and can create packing lists when traveling.
- **Cost Per Wear Tracking**
    - As a user, I want to be able to track what I've paid for items in my wardrobe and see the running cost per wear so that my shopping decisions can be better informed.
- **Specific Occasion Filter**
    - As a user, I want to be able to filter my outfit recommendations based on what I have planned for the day so that I get better recommendations more quickly.
- **More Detailed User Profile**
    - As a user, I want to be able to save more information about myself to my profile so that I get better recommendations more quickly.

## Wire Frames
### Application Web Pages

![Wireframes](https://github.com/Matt-Gallery/weather-wardrobe/blob/main/Wireframes.png?raw=true)

## Component Hierarchy Diagram
![Component Hierarchy Diagram.png](https://github.com/Matt-Gallery/cloud-closet-front-end/blob/main/Component%20Hierarchy%202.png?raw=true)

## Entity Relationship Diagram (ERD)

![ERD](https://github.com/Matt-Gallery/cloud-closet-front-end/blob/main/ERD%202.png?raw=true)

## Routing Table

#### Authentication
| HTTP Method | Path            | Purpose                   |
|-------------|-----------------|---------------------------|
| POST        | /auth/signup    | Create account (Sign-up)  |
| POST        | /auth/signin    | Log into account (Sign-in)|
| POST        | /auth/signout   | Log out of account        |

#### User Account
| HTTP Method | Path                | Purpose                       |
|-------------|---------------------|-------------------------------|
| GET         | /account            | View account details          |
| PUT         | /account            | Edit/update account details   |
| DELETE      | /account            | Delete account                |

#### Wardrobe Items
| HTTP Method | Path                  | Purpose                             |
|-------------|-----------------------|-------------------------------------|
| GET         | /closet               | View all wardrobe items             |
| POST        | /closet               | Add new wardrobe item               |
| PUT         | /closet/:itemId       | Edit/update a specific wardrobe item|
| DELETE      | /closet/:itemId       | Delete a specific wardrobe item     |

#### Outfit Recommendations
| HTTP Method | Path                     | Purpose                                                   |
|-------------|--------------------------|-----------------------------------------------------------|
| GET         | /outfits/recommendations | View today's recommended outfit(s) based on weather       |
| POST        | /outfits/recommendations/cycle-item | Cycle individual item recommendation          |
| POST        | /outfits/recommendations/cycle-outfit | Cycle entire outfit recommendation          |
| POST        | /outfits/recommendations/dislike | Permanently dislike an outfit recommendation     |

#### Rated Outfits
| HTTP Method | Path                 | Purpose                               |
|-------------|----------------------|---------------------------------------|
| GET         | /outfits/rated       | View all rated outfits                |
| PUT         | /outfits/rated/:outfitId | Edit a rated outfit               |
| DELETE      | /outfits/rated/:outfitId | Delete a rated outfit             |

#### Weather
| HTTP Method | Path                 | Purpose                               |
|-------------|----------------------|---------------------------------------|
| GET         | /weather             | Get current weather information       |

## Timeline

| Day        |   | Task                               | Blockers | Notes/ Thoughts |
|------------|---|------------------------------------|----------|-----------------|
| Monday     |   | Create and present proposal        |          |                 |
| Tuesday    |   | Create Auth, Routes, Components    |          |                 |
| Wedenesday |   | Integrate Front & Back Ends        |          |                 |
| Thursday   |   | Work on JavaScript & CSS           |          |                 |
| Friday     |   | Test and finalize MVP              |          |                 |
| Saturday   |   | Work on stretch goals              |          |                 |
| Sunday     |   | Final testing and styling          |          |                 |
| Monday     |   | Present                            |          |                 |
