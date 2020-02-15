# quittung
__quittung__ intends to provide a simple and foolproof interface to create and
print receipts (German: Quittung).

Setup steps
-----------
1. Clone repository
  `git clone https://github.com/p3732/quittung.git`

2. Install required npm packages
```
  cd quittung
  npm install .
```

3. Setup configuration
  `cp -R config_example config`

  These can be changed to fit your intended usage. The config files should
  have enough comments to make them self-explanatory. (In case they are not,
  please open an issue.)

  Hint for developers:
  A symlink is handy to avoid copying changed default values.

  `ln -s config_example config`

4. Start the server
  `node init`

