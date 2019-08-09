# reddit Comment Navigator (rcn)
Use keyboard keys to upvote, downvote, collapse/expand & navigate through comments.

```
KEYBINDS
--------
h - prev on same level
l - next on same level
j - move one level up
k - move one level down
q - upvote
e - downvote
r - collapse/expand
```
Current functionality:
* Navigate through comments
* Upvote/downvote them
* Collapse/expand while reading
* all with your keyboard keys

Issues:
* Cursor position resets to 0 when climbing ([#1](https://github.com/kittenparry/reddit-comment-navigator/issues/1))
* If no more comments are present, tries to go down to nether realms ([#2](https://github.com/kittenparry/reddit-comment-navigator/issues/2))
* Upvoting/downvoting in quick succession doesn't register every action (see what you get by refreshing the page) ([#4](https://github.com/kittenparry/reddit-comment-navigator/issues/4))
