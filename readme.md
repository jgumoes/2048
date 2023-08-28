# 2048 Clone
I like the game, but I don't like the ads. Also, my brother keeps insisting I only beat the game by using the back button, so I'm making a clone will help get him to shut up and recognise my intellectual superiority.

## Back button

Inspired by a university coursework that led to me researching psychology journals for how to encourage pro-environmental behaviour, I will use pro-social motivators in a cutting-edge scientific technique known as "shame". The game will remember how many times the back button was pressed and will stratify the high-score table accordingly. Also, when the button is pressed, the app will inform the user that that was a "weak move".

## Logic Approach

For a given grid state, when a user swipes in a direction, the Grid class will iterate through the grid in the swipe direction i.e. "left" will go from top to bottom, left to right, and "up" will go bottom to top, left to right. Each element in a line is added to the NewGrid class, which will construct a new grid with the numbers in the expected place, merging if necessary. React will read and draw the new grid state, and will the animations are running, a new number will replace one of the zeros.

TODO: maybe all 4 directions should be pre-calculated, and the class just hands over the correct grid? This could improve performance after swiping, and test for invalid swipes and the end-game condition.

### Inserting a new tile

After swiping, a new tile needs to be placed in an empty space (represented by 0s). I could just run a random number generator repeatedly until the coordinates it creates point to a 0 in the grid, or I could know where the zeros are and randomly select one of those locations. I prefer the latter as it bounds the maximum time taken to find a valid location, as opposed to random which could be technically infinite and the time taken will increase as the grid fills.

I tried a couple of different ways of finding a location, and timed the results for comparison, but they were all within 2 nS so I just went with the one I liked the most.

## Testing

Testing is done using Jest, and React Native testing Library is used to test user interactions such as button presses. Unfortunately, React Native Gesture Handler does not work in testing environments and any documentation is for the old api and therefore ~2+ years out of date, so I've had to mock out the entire library for UI testing to work. This means that users swiping the grid has not been directly tested, only through calling the swipe() method on the testing Grid instance.