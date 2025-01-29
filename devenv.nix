{
  config,
  pkgs,
  ...
}:
{
  services.mysql = {
    enable = true;
    initialDatabases = [
      {
        name = "testdb";
        schema = ./server/db/schema.sql;
      }
    ];
    ensureUsers = [
      {
        name = "root";
        ensurePermissions = {
          "testdb.*" = "ALL PRIVILEGES";
        };
      }
      {
        name = "backup";
        ensurePermissions = {
          "*.*" = "SELECT, LOCK TABLES";
        };
      }
    ];
  };

}
