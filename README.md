# Subscache C4 for Meteor
_Most useful subscription caching, ever_

This project was forked from https://github.com/ccorcos/meteor-subs-cache because we were not happy with the rate at which pull requests were being merged.

## The problem

Suppose you are subscribing to a post:

    sub = Meteor.subscribe('post', postId)

When the user clicks to another page, you typically want to stop the subscription

    subs.stop()

This will clean up and throw away the data you don't need. But what if the user clicks back immediately after you stopped the subscription? Now you have resubscribe to the same data. This is a waste. SubsCache allows you to cache your subscriptions. When you stop a SubCache subscription, it will start a setTimeout and stop the subscription after `expireAfter` minutes. If you resubscribe to the same subscription before the cached subscription expired, then the setTimeout is cleared and the subscription is restored.

## Comparison to `meteorhacks:subs-manager`

1. SubsManager [will stop your subscription "expireIn" minutes after your subscribtion **starts**](https://github.com/meteorhacks/subs-manager/blob/master/lib/sub_manager.js#L94). SubsCache C4 will stop your subscription "expireAfter" minutes after your subscription **stop** (or the current reative computation stops).


2. SubsManager does not have a ready function for **each** subscription. [subsManager.ready](https://github.com/meteorhacks/subs-manager/blob/master/lib/sub_manager.js#L110) tells you if **all** cached subscriptions are ready. SubsCache can tell you when everything is ready too, using `subsCache.allReady()` byt it can also do this on an individual per-subscription basis with `sub.ready()`.

3. SubsManager does not allow you to have subscriptions with different expiration times in the same cache. SubsCache allows you set the default `expireAfter` upon initialization but you can use `subscribeFor(expireAfter, ...)` to subscribe and cache for a different time.

4. SubsManager does not allow infinite items in a cache. SubsCache does if you set `cacheLimit` to -1.

5. SubsManager does not allow subscriptions that never expire. SubsCache does if you set `expireAfter` to -1.

## Getting Started

    meteor add blockrazor:subscache-c4

Initialize with optional `expireAfter` (default 5) and `cacheLimit` (default 10). `expireAfter` is the number of minutes after a subscription is stopped without having been restarted before truely stopping it. If set to -1, the subscription will never expire. `cacheLimit` is the max number of subscriptions to cache. Set to -1 for unlimited capacity.

```
    subsCache = new SubsCache(5, 10);
    // first argument is expireAter -- default is 5 minutes
    // second argument is cacheLimit -- default is 10
```

- `sub = subsCache.subscribe(...)` creates a subscription just like `Meteor.subscribe`

- `sub = subsCache.subscribeFor(expireIn, ...)` allow you to set the expiration other than the defualt.

- `subsCache.clear()` will stop all subscription immediately

- `subsCache.ready()` tells you if all subscriptions in the cache are ready

- `subsCache.onReady(func)` will call a function once all subscription are ready

- `sub.stop()` will cache a subscription and stop after `expireAfter` unless restarted with `sub.restart()`

- `sub.stopNow()` will stop a subscription immediately and remove it from the cache.

- `sub.ready()` tells you if an individual subscription is ready

- `sub.onReady(func)` will call a function once an individual subscription is ready

## Testing

You can run the mocha-based tests in watch mode via:

`meteor test-packages ./ --driver-package practicalmeteor:mocha`

## Known issues

### No data is injected when using with Fast Render

When using the Fast Render package the parameters passed to the subscription must the identical on both Fast Render and Subscache or no data will be injected.

## Contributing

A cardinal sin that many open source developers make is to place themselves above others. "_I founded this project thus my intellect is superior to that of others_". It's immodest and rude, and usually inaccurate. The contribution policy we use applies equally to everyone, without distinction.    

The contribution policy we follow is the [Collective Code Construction Contract (C4)](/CONTRIBUTING.MD)    

If you're wondering why any of the rules in the C4 are there, take a look at the [line by line explanation](/DESCRIPTIVE_C4.MD) of everything in the C4, this explains the rationale and history behind everything in the protocol and makes it easier to understand.

As this project has only recently been migrated to the Blockrazor organization and the pul request history comes from the [original](https://github.com/ccorcos/meteor-subs-cache) project, you should look at past [Blockrazor pull requests](https://github.com/Blockrazor/blockrazor/pulls?q=is%3Apr+is%3Aclosed) to see how to do things with the C4 - the original project did not follow this contribution protocol.

<details>
  <summary>Step-by-step guide to sending a pull request</summary>
<p>

0. Read the [contribution protocol](/CONTRIBUTING.MD) and the [line by line explanation](/DESCRIPTIVE_C4.MD) of the protocol.    
1. Fork this github repository under your own github account.    
2. Clone _your_ fork locally on your development machine.   
3. Choose _one_ problem to solve. If you aren't solving a problem that's already in the issue tracker you should describe the problem there (and your idea of the solution) first to see if anyone else has something to say about it (maybe someone is already working on a solution, or maybe you're doing somthing wrong).

**If the issue is in the issue tracker, you should comment on the issue to say you're working on the solution so that other people don't work on the same thing.**    

4. Add this repository as an upstream source and pull any changes:    
```
@: git remote add upstream git://github.com/blockrazor/subscache-C4 //only needs to be done once
@: git checkout master //just to make sure you're on the correct branch
@: git pull upstream master //this grabs any code that has changed, you want to be working on the latest 'version'
@: git push //update your remote fork with the changes you just pulled from upstream master
```
5. Create a local branch on your machine `git checkout -b branch_name` (it's usually a good idea to call the branch something that describes the problem you are solving). _Never_ develop on the `master` branch, as the `master` branch is exclusively used to accept incoming changes from `upstream:master` and you'll run into problems if you try to use it for anything else.
6. Solve the problem in the absolute most simple and fastest possible way with the smallest number of changes humanly possible. Tell other people what you're doing by putting _very clear and descriptive comments in your code every 2-3 lines_.    
Add your name to the AUTHORS file so that you become a part owner of Subscache C4.    
7. Commit your changes to your own fork:
Before you commit changes, you should check if you are working on the latest version (again). Go to the github website and open _your_ fork of Subscache C4, it should say _This branch is even with subscache-c4:master._    
If **not**, you need to pull the latest changes from the upstream repository and replay your changes on top of the latest version:
```
@: git stash //save your work locally
@: git checkout master
@: git pull upstream master
@: git push
@: git checkout -b branch_name_stash
@: git stash pop //_replay_ your work on the new branch which is now fully up to date with the Subscache C4 repository
```

Note: after running `git stash pop` you should run Meteor and look over your code again and check that everything still works as sometimes a file you worked on was changed in the meantime.

Now you can add your changes:   
```
@: git add changed_file.js //repeat for each file you changed
```

And then commit your changes:
```
@: git commit -m 'problem: <50 characters describing the problem //do not close the '', press ENTER two (2) times
>
>solution: short description of how you solved the problem.' //Now you can close the ''. Be sure to mention the issue number if there is one (e.g. #6)    
@: git push //this will send your changes to _your_ fork on Github
```    
8. Go to your fork on Github and select the branch you just worked on. Click "pull request" to send a pull request back to the Subscache C4 repository.
9. Send the pull request.   

#### What happens after I send a pull request?    
If your pull request contains a correct patch (read the C4) a maintainer will merge it.    
If you want to work on another problem while you are waiting for it to merge simply repeat the above steps starting at:    
```
@: git checkout master
```

You should generally write a test for anything you don't want to break later, otherwise it will probably end up being broken by someone. We use [Mocha + Chai](https://guide.meteor.com/testing.html#mocha) for testing. You can see an example in [this](https://github.com/Blockrazor/blockrazor/pull/378/files) pull request.
</p>
</details> 

## LICENSE

The license and contribution policy are two halves of the same puzzle. This project is licensed under the [MPL v2.0 license](LICENSE). The code is owned (and Copyright) by _all_ contributors. Contributors are listed in the [AUTHORS](AUTHORS) file. Please add your name to the end of this file in your first pull request so that you also become an owner. If you contributed to a previous fork of this project, you are also welcome to add your name to this list.

This license ensures that:
1. Contributors to Subscache C4 cannot have their code stolen and used by closed-source projects without their permission. It's very common for corporate software merchants to steal code from open source projects and use it in their closed source or even patented products and services in direct competition with the original project. For example, anyone who contributes code to a project released under a BSD/MIT style license effectively has no rights to their own code or any improvements made upon it.
2. Anyone using any code from Subscache C4 must also share their work under a _share-alike_ license so that anyone else can also use their improvements.
3. No one can change the above, without explicit written permission from _all_ contributors, which is essentially impossible to get. That means even the founder of this project cannot ever relicense and sell Subscache C4 and its code. It belongs to everyone who contributed to it (and it always will).

It is not permissible to use _any_ code added to this codebase from the date it was forked from the original unlicensed repository in _anything_ that isn't using a _share-alike_ license. Violations of the license will absolutely not be tolerated, and the terms of this license will be _brutally_ enforced through a variety of _very_ creative methods (except if you contributed to the project this was forked from).
